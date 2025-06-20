// app/lecturer/attendance/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

interface ServerActionResponse {
  success: boolean;
  message?: string;
  newQrValue?: string;
  error?: string;
  sessionId?: string;
}

/**
 * Creates a new session, linking it to a specific course-intake offering.
 * If the course-intake pairing doesn't exist in `course_intakes` table, it creates it.
 * This function is designed to be "production-ready" with comprehensive logging and error handling.
 * @param courseId The ID of the course.
 * @param intakeId The ID of the intake. // NEW: intakeId is now required for linking to course_intakes
 * @param sessionDate The date of the session (YYYY-MM-DD).
 * @param startTime The start time of the session (HH:MM:SS).
 * @param endTime The end time of the session (HH:MM:SS).
 * @returns ServerActionResponse indicating success/failure and session ID.
 */
export async function createSession(
  courseId: string,
  intakeId: string, // Changed signature to include intakeId
  sessionDate: string,
  startTime: string,
  endTime: string
): Promise<ServerActionResponse> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Authentication error in createSession:', userError?.message);
    return { success: false, error: 'Authentication failed. Please log in.' };
  }

  // Security Check: Verify user is a lecturer
  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !userProfile || userProfile.role !== 'lecturer') {
    console.warn('Unauthorized attempt to create session by user:', user.id, 'Role:', userProfile?.role);
    return { success: false, error: 'Access denied. Only lecturer can create sessions.' };
  }

  try {
    // Basic validation for all required fields
    if (!courseId || !intakeId || !sessionDate || !startTime || !endTime) {
      console.error('Validation error in createSession: Missing required fields.', { courseId, intakeId, sessionDate, startTime, endTime });
      return { success: false, error: 'All session fields including course and intake are required.' };
    }

    console.log('Attempting to create session for Course ID:', courseId, 'Intake ID:', intakeId, 'Lecturer ID:', user.id);

    // --- Step 1: Find or create the entry in the `course_intakes` junction table ---
    const { data: courseIntake, error: ciFetchError } = await supabase
      .from('course_intakes')
      .select('id')
      .eq('course_id', courseId)
      .eq('intake_id', intakeId)
      .single();

    let courseIntakeId: string | null = null;

    if (ciFetchError) {
      // PGRST116 indicates no rows found, which is expected if the pair doesn't exist
      if (ciFetchError.code === 'PGRST116' || ciFetchError.message === 'No rows found') {
        console.log('No existing course_intake found for this pair. Attempting to create a new one...');
        const { data: newCi, error: newCiInsertError } = await supabase
          .from('course_intakes')
          .insert({ course_id: courseId, intake_id: intakeId })
          .select('id')
          .single();

        if (newCiInsertError) {
          console.error('ERROR: Failed to create new course_intake entry:', newCiInsertError);
          return { success: false, error: `Failed to prepare session (could not create course-intake link): ${newCiInsertError.message}` };
        }
        courseIntakeId = newCi.id;
        console.log('Successfully created new course_intake with ID:', courseIntakeId);
      } else {
        // Handle other unexpected database errors during course_intake fetch
        console.error('ERROR: Unhandled database error fetching course_intake:', ciFetchError);
        return { success: false, error: `Failed to prepare session (DB error): ${ciFetchError.message}` };
      }
    } else if (courseIntake) {
      // Existing course_intake was found
      courseIntakeId = courseIntake.id;
      console.log('Existing course_intake found with ID:', courseIntakeId);
    }

    // Critical check: Ensure courseIntakeId was successfully determined
    if (!courseIntakeId) {
      console.error('ERROR: courseIntakeId is NULL or undefined after processing course_intakes logic. This should not happen.');
      return { success: false, error: 'Internal error: Could not establish a valid course-intake link.' };
    }

    // --- Step 2: Insert the new session into the 'sessions' table using course_intake_id ---
    console.log('Attempting to insert session into public.sessions with course_intake_id:', courseIntakeId);
    const { data: newSession, error: insertError } = await supabase
      .from('sessions')
      .insert({
        course_intake_id: courseIntakeId, // Link session to the course_intake entry
        session_date: sessionDate,
        start_time: startTime,
        end_time: endTime,
        lecturer_id: user.id,
        is_attendance_active: false, // Sessions are inactive by default when created
      })
      .select('id') // Select the ID of the newly created session
      .single();

    if (insertError) {
      console.error('ERROR: Failed to create session entry:', insertError);
      return { success: false, error: `Failed to create session: ${insertError.message}` };
    }

    console.log('Session created successfully with ID:', newSession.id);
    return { success: true, message: 'Session created successfully!', sessionId: newSession.id };

  } catch (error: unknown) {
    // Catch any unexpected runtime errors
    console.error('Unexpected critical error in createSession:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during session creation.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Generates/refreshes QR code value for an active session.
 * Includes security checks for lecturer role and session ownership.
 * @param sessionId The ID of the session.
 * @returns ServerActionResponse with new QR value or error.
 */
export async function generateQrCode(sessionId: string): Promise<ServerActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  // Verify user role
  const { data: userProfile, error: profileError } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profileError || userProfile?.role !== 'lecturer') {
    return { success: false, error: 'Access denied. Only lecturer can manage attendance.' };
  }

  // Fetch session data, including lecturer_id for ownership check
  // Removed 'course_id' from select as it's no longer directly on sessions table
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('is_attendance_active, last_qr_code_generated_at, last_qr_code_value, lecturer_id')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    console.error('Session fetch error in generateQrCode:', sessionError);
    return { success: false, error: 'Session not found or database error.' };
  }

  if (session.lecturer_id !== user.id) {
    return { success: false, error: 'You do not have permission to manage this session.' };
  }

  if (!session.is_attendance_active) {
    return { success: false, error: 'Attendance is not active for this session.' };
  }

  const lastGeneratedTime = new Date(session.last_qr_code_generated_at || 0);
  const currentTime = new Date();
  const timeDiffSeconds = (currentTime.getTime() - lastGeneratedTime.getTime()) / 1000;

  // Refresh QR code if 30 seconds have passed or it's the first time
  if (timeDiffSeconds >= 30 || !session.last_qr_code_generated_at) {
    const newQrValue = `${sessionId}-${uuidv4()}`;

    const { error: updateError } = await supabase
      .from('sessions')
      .update({
        last_qr_code_value: newQrValue,
        last_qr_code_generated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Error updating session QR in generateQrCode:', updateError);
      return { success: false, error: 'Failed to update QR code in database.' };
    }

    return { success: true, newQrValue: newQrValue };
  } else {
    // QR not yet due for refresh, return current value
    return { success: true, message: 'QR not yet due for refresh.', newQrValue: session.last_qr_code_value || undefined };
  }
}

/**
 * Starts attendance for a given session.
 * Includes security checks for lecturer role and session ownership.
 * @param sessionId The ID of the session.
 * @returns ServerActionResponse indicating success/failure.
 */
export async function startAttendance(sessionId: string): Promise<ServerActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  // Verify user role and ownership
  const { data: userProfile, error: profileError } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profileError || userProfile?.role !== 'lecturer') {
    return { success: false, error: 'Access denied.' };
  }

  // Removed 'course_id' from select as it's no longer directly on sessions table
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('lecturer_id')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return { success: false, error: 'Session not found.' };
  }

  if (session.lecturer_id !== user.id) {
    return { success: false, error: 'You do not have permission to manage this session.' };
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      is_attendance_active: true,
      attendance_window_start: new Date().toISOString(),
      last_qr_code_value: null,
      last_qr_code_generated_at: null,
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error starting attendance:', error);
    return { success: false, error: 'Failed to start attendance.' };
  }
  return { success: true, message: 'Attendance started successfully.' };
}

/**
 * Ends attendance for a given session.
 * Includes security checks for lecturer role and session ownership.
 * @param sessionId The ID of the session.
 * @returns ServerActionResponse indicating success/failure.
 */
export async function endAttendance(sessionId: string): Promise<ServerActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized. Please log in.' };
  }

  // Verify user role and ownership
  const { data: userProfile, error: profileError } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profileError || userProfile?.role !== 'lecturer') {
    return { success: false, error: 'Access denied.' };
  }

  // Removed 'course_id' from select as it's no longer directly on sessions table
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('lecturer_id')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    return { success: false, error: 'Session not found.' };
  }

  if (session.lecturer_id !== user.id) {
    return { success: false, error: 'You do not have permission to manage this session.' };
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      is_attendance_active: false,
      attendance_window_end: new Date().toISOString(),
      last_qr_code_value: null,
      last_qr_code_generated_at: null,
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error ending attendance:', error);
    return { success: false, error: 'Failed to end attendance.' };
  }
  return { success: true, message: 'Attendance ended successfully.' };
}
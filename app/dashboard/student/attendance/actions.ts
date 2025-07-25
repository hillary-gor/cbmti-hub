"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

// Define the response structure for the markAttendance action
interface MarkAttendanceResponse {
  success: boolean;
  message?: string;
  error?: string;
  attendanceId?: string;
}

/**
 * Server action to mark a student's attendance for a given session.
 * Performs various validations including user authentication, role, session status,
 * QR code validity, and duplicate attendance.
 *
 * @param sessionId The ID of the session to mark attendance for.
 * @param scannedQrValue The QR code value scanned by the student.
 * @returns A Promise resolving to a MarkAttendanceResponse object indicating success or failure.
 */
export async function markAttendance(
  sessionId: string,
  scannedQrValue: string,
): Promise<MarkAttendanceResponse> {
  const supabase = await createClient(); // Initialize Supabase client for server actions
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(); // Get authenticated user

  // 1. Authentication Check
  if (userError || !user) {
    console.error("Authentication failed:", userError?.message);
    return { success: false, error: "Authentication failed. Please log in." };
  }

  // 2. Role Check: Ensure the authenticated user has a 'student' role
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "student") {
    console.error(
      "Authorization failed: User not a student or profile not found.",
      profileError,
    );
    return {
      success: false,
      error: "Access denied. Only students can mark attendance.",
    };
  }

  // 3. Fetch Session Details for Validation
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select(
      "last_qr_code_value, attendance_window_start, attendance_window_end, is_attendance_active",
    )
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    console.error(
      `Session fetch failed for ID ${sessionId}:`,
      sessionError?.message,
    );
    return {
      success: false,
      error: "Session not found or details unavailable.",
    };
  }

  const currentTime = new Date();
  // Parse window start and end times, handling potential null values
  const windowStart = session.attendance_window_start
    ? new Date(session.attendance_window_start)
    : null;
  const windowEnd = session.attendance_window_end
    ? new Date(session.attendance_window_end)
    : null;

  // 4. Validate Attendance Window and Active Status
  // A session is considered open for attendance if:
  // - It is explicitly marked as active (`is_attendance_active: true`)
  // - Its start time exists and the current time is past the start time
  // - AND (
  //   - Its end time is null (meaning it's an open-ended attendance window)
  //   OR
  //   - Its end time exists and the current time is before the end time
  // )
  if (
    !session.is_attendance_active || // Session attendance is not active
    !windowStart || // Session has no defined start time
    currentTime < windowStart || // Current time is before the attendance window start
    (windowEnd && currentTime > windowEnd) // Session has an end time and current time is past it
  ) {
    console.warn(
      `Attendance window validation failed for session ${sessionId}. Is active: ${session.is_attendance_active}, Start: ${windowStart?.toISOString()}, End: ${windowEnd?.toISOString()}, Current: ${currentTime.toISOString()}`,
    );
    return {
      success: false,
      error:
        "Attendance is not currently open for this session. It might be closed, not yet started, or expired.",
    };
  }

  // 5. Validate QR Code Match
  if (
    !session.last_qr_code_value ||
    session.last_qr_code_value !== scannedQrValue
  ) {
    console.warn(
      `QR code mismatch for session ${sessionId}. Expected: ${session.last_qr_code_value}, Received: ${scannedQrValue}`,
    );
    return {
      success: false,
      error: "Invalid or expired QR code. Please scan the latest QR code.",
    };
  }

  // 6. Check for Existing Attendance Record (prevent duplicate marking)
  const { data: existingAttendance, error: existingAttendanceError } =
    await supabase
      .from("attendance")
      .select("id")
      .eq("session_id", sessionId)
      .eq("student_id", user.id)
      .single();

  if (existingAttendanceError && existingAttendanceError.code !== "PGRST116") {
    // PGRST116 means 'No rows found'
    console.error(
      "Error checking existing attendance:",
      existingAttendanceError,
    );
    return {
      success: false,
      error: "Database error while checking your previous attendance.",
    };
  }
  if (existingAttendance) {
    console.warn(
      `Duplicate attendance detected for student ${user.id} in session ${sessionId}.`,
    );
    return {
      success: false,
      error: "You have already marked attendance for this session.",
    };
  }

  // 7. Get Client IP Address (for logging/security, best effort)
  // headers() is a Next.js specific function to access request headers in Server Actions.
  const ipAddress =
    (await headers()).get("x-forwarded-for") ||
    (await headers()).get("x-real-ip") ||
    (await headers()).get("cf-connecting-ip");

  // 8. Insert New Attendance Record
  const { data: newAttendance, error: insertError } = await supabase
    .from("attendance")
    .insert({
      session_id: sessionId,
      student_id: user.id,
      status: "present", // Assuming 'present' is the default status for marked attendance
      marked_at: new Date().toISOString(), // Record the exact time of marking
      ip_address: ipAddress || null, // Store IP address if available
    })
    .select("id") // Select the ID of the newly inserted record
    .single();

  if (insertError) {
    console.error("Error inserting attendance record:", insertError);
    return {
      success: false,
      error: "Failed to mark attendance due to a database issue.",
    };
  }

  return {
    success: true,
    message: "Attendance marked successfully!",
    attendanceId: newAttendance.id,
  };
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { QRCodeScanner } from '@/components/QRCodeScanner';
import { SessionWithCourseAndIntake } from '@/types/supabase';
import { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Import the server action for marking attendance
import { markAttendance } from '../attendance/actions';

// Type definitions for improved readability and type safety
type LastAttendanceRecord = {
  marked_at: string;
  session_id: string;
};

type LastAttendanceSessionDetails = {
  course_intakes: {
    courses: { title: string; } | null;
  } | null;
};

interface EnrolledCourseDisplay {
  id: string;
  title: string;
  code: string;
}

/**
 * StudentAttendancePage component allows students to mark attendance by scanning a QR code.
 * It fetches relevant sessions for the student's enrolled courses and provides real-time updates
 * on session status. Students can select a session to mark attendance.
 */
export default function StudentAttendancePage() {
  const supabase = createClient();

  // State variables to manage UI and data flow
  const [currentSession, setCurrentSession] = useState<SessionWithCourseAndIntake | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState<'pending' | 'marked' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State for user-specific data
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourseDisplay[] | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [lastMarkedAttendance, setLastMarkedAttendance] = useState<{ courseTitle: string; markedAt: string } | null>(null);

  // State to hold all categorized sessions (active, upcoming, closed)
  const [allSessions, setAllSessions] = useState<(SessionWithCourseAndIntake & { status: 'active' | 'upcoming' | 'closed' })[] | null>(null);

  /**
   * Fetches all relevant sessions for the authenticated student, categorizes them
   * (active, upcoming, closed), and sets the component state.
   * This function also handles user details and their last attendance record.
   */
  const fetchAllAndCategorizeSessions = useCallback(async () => {
    setLoading(true); // Indicate loading state
    setErrorMessage(null); // Clear previous errors
    setCurrentSession(null); // Clear any auto-selected session

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // Handle user authentication errors
    if (userError) {
      console.error('Error fetching user:', userError.message);
      setLoading(false);
      setErrorMessage('Could not retrieve user information. Please log in again.');
      return;
    }

    // If no user is found, stop loading and return
    if (!user) {
      setLoading(false);
      return;
    }
    console.log('Logged in user ID:', user.id);

    // Fetch user's full name from the 'users' table
    const { data: userData, error: userDetailsError } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single();

    if (userDetailsError && userDetailsError.code !== 'PGRST116') { // PGRST116 means 'No rows found'
      console.error('Error fetching user details from users table:', userDetailsError.message);
    } else if (userData) {
      setUserName(userData.full_name || user.email?.split('@')[0] || null);
    } else {
      setUserName(user.email?.split('@')[0] || null); // Fallback to email if no full_name
    }

    // Fetch the student's latest attendance record
    const { data: latestAttendanceRecord, error: attendanceRecordError } = await supabase
      .from('attendance')
      .select('marked_at, session_id')
      .eq('student_id', user.id)
      .order('marked_at', { ascending: false })
      .limit(1)
      .single() as { data: LastAttendanceRecord | null; error: PostgrestError | null };

    if (attendanceRecordError && attendanceRecordError.code !== 'PGRST116') {
      console.error('Error fetching latest attendance record:', attendanceRecordError.message);
    } else if (latestAttendanceRecord && latestAttendanceRecord.session_id) {
      // If a record is found, fetch details of that session's course
      const { data: sessionDetails, error: sessionDetailsError } = await supabase
        .from('sessions')
        .select(`
          course_intakes(
            courses(title)
          )
        `)
        .eq('id', latestAttendanceRecord.session_id)
        .single() as { data: LastAttendanceSessionDetails | null; error: PostgrestError | null };

      if (sessionDetailsError && sessionDetailsError.code !== 'PGRST116') {
        console.error('Error fetching session details for last attendance:', sessionDetailsError.message);
      } else if (sessionDetails?.course_intakes?.courses?.title) {
        setLastMarkedAttendance({
          courseTitle: sessionDetails.course_intakes.courses.title,
          markedAt: new Date(latestAttendanceRecord.marked_at).toLocaleString(),
        });
      } else {
        setLastMarkedAttendance(null);
      }
    } else {
      setLastMarkedAttendance(null);
    }

    // Fetch all course IDs the student is enrolled in
    const { data: enrollmentsData, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('user_id', user.id);

    if (enrollmentsError) {
      console.error('Error fetching student enrollments:', enrollmentsError.message);
      setLoading(false);
      setErrorMessage('Failed to load your enrolled courses.');
      return;
    }

    const enrolledCourseIds = enrollmentsData?.map(s => s.course_id) || [];
    console.log('Enrolled Course IDs:', enrolledCourseIds);

    // Fetch details for the enrolled courses
    if (enrolledCourseIds.length > 0) {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title, code')
        .in('id', enrolledCourseIds);

      if (coursesError) {
        console.error('Error fetching enrolled courses details:', coursesError.message);
        setErrorMessage(prev => prev ? prev + ' Also failed to load full course details.' : 'Failed to load some course details.');
      } else {
        setEnrolledCourses(coursesData as EnrolledCourseDisplay[]);
      }
    } else {
      setEnrolledCourses([]); // Student is not enrolled in any courses
    }

    // If no courses are enrolled, there are no sessions to fetch
    if (enrolledCourseIds.length === 0) {
      setLoading(false);
      setErrorMessage(null);
      setAllSessions([]);
      return;
    }

    // Fetch course intakes relevant to the enrolled courses
    const { data: courseIntakesForCourses, error: courseIntakesError } = await supabase
      .from('course_intakes')
      .select('id')
      .in('course_id', enrolledCourseIds);

    if (courseIntakesError) {
      console.error('Error fetching course intakes for enrolled courses:', courseIntakesError.message);
      setLoading(false);
      setErrorMessage('Failed to load course intakes relevant to your enrollment.');
      return;
    }

    const relevantCourseIntakeIds = courseIntakesForCourses?.map(ci => ci.id) || [];
    console.log('Relevant Course Intake IDs:', relevantCourseIntakeIds);

    // If no relevant course intakes, no sessions to fetch
    if (relevantCourseIntakeIds.length === 0) {
      setLoading(false);
      setErrorMessage(null);
      setAllSessions([]);
      return;
    }

    // Fetch all sessions related to the relevant course intakes
    const { data: fetchedSessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`*,
        course_intakes(
          id,
          courses(
            id, title, code
          ),
          intakes(
            id, label
          )
        )
      `)
      .in('course_intake_id', relevantCourseIntakeIds);

    if (sessionsError) {
      console.error('Error fetching all relevant sessions:', sessionsError.message);
      setErrorMessage('Failed to load sessions. Please try refreshing the page.');
      setLoading(false);
      return;
    }

    const sessions: SessionWithCourseAndIntake[] = (fetchedSessions || []) as SessionWithCourseAndIntake[];

    const currentTime = new Date();
    const twentyFourHoursAgo = new Date(currentTime.getTime() - 24 * 60 * 60 * 1000);

    // Categorize sessions based on their attendance window and active status
    const categorizedSessions = sessions.map(session => {
      const sessionStart = session.attendance_window_start ? new Date(session.attendance_window_start) : null;
      const sessionEnd = session.attendance_window_end ? new Date(session.attendance_window_end) : null;
      let status: 'active' | 'upcoming' | 'closed' = 'closed';

      // A session is active if 'is_attendance_active' is true
      // AND its 'attendance_window_start' is in the past
      // AND (its 'attendance_window_end' is null OR its 'attendance_window_end' is in the future)
      if (session.is_attendance_active && sessionStart && sessionStart < currentTime && (!sessionEnd || currentTime < sessionEnd)) {
        status = 'active';
      }
      // A session is upcoming if its 'attendance_window_start' is in the future
      else if (sessionStart && currentTime < sessionStart) {
        status = 'upcoming';
      }
      // A session is closed if its 'attendance_window_end' exists and is in the past (within 24 hours)
      else if (sessionEnd && sessionEnd < currentTime && sessionEnd > twentyFourHoursAgo) {
        status = 'closed'; // Recently closed
      }
      // Otherwise, it's considered closed (e.g., older sessions, or inactive sessions without an end time within 24hrs)
      else {
        status = 'closed';
      }

      return { ...session, status };
    });

    setAllSessions(categorizedSessions as (SessionWithCourseAndIntake & { status: 'active' | 'upcoming' | 'closed' })[]);

    // Auto-select an active session if there's exactly one
    const activeSessions = categorizedSessions.filter(s => s.status === 'active');
    if (activeSessions.length === 1) {
      const autoSelectedSession = activeSessions[0] as SessionWithCourseAndIntake;
      setCurrentSession(autoSelectedSession);

      // Check if attendance is already marked for the auto-selected session
      const { data: marked, error: markedError } = await supabase
        .from('attendance')
        .select('id')
        .eq('session_id', autoSelectedSession.id)
        .eq('student_id', user.id)
        .single();

      if (markedError && markedError.code !== 'PGRST116') {
        console.error('Error checking existing attendance status for auto-selected session:', markedError.message);
        setErrorMessage('Error checking attendance status.');
      } else if (marked) {
        setAttendanceStatus('marked');
        toast.success('You have already marked attendance for this session!', { id: 'already-marked' });
      } else {
        setAttendanceStatus(null); // Ready to mark attendance
      }
    } else {
      setCurrentSession(null); // No session auto-selected
      setAttendanceStatus(null);
    }

    setLoading(false); // End loading state
  }, [supabase]); // Depend on supabase client to re-run if it changes (though usually static)

  /**
   * Handles manual selection of a session from the list.
   * Checks if the selected session is active and if attendance has already been marked.
   */
  const handleSessionSelect = useCallback(async (session: SessionWithCourseAndIntake & { status: string }) => {
    // Prevent selection if session is not active
    if (session.status !== 'active') {
      toast.error('Only active sessions can be selected for attendance.', { id: 'select-inactive-session' });
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setCurrentSession(session); // Set the selected session

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setErrorMessage('User not found. Please log in again.');
      setLoading(false);
      return;
    }

    // Check if attendance has already been marked for the manually selected session
    const { data: marked, error: markedError } = await supabase
      .from('attendance')
      .select('id')
      .eq('session_id', session.id)
      .eq('student_id', user.id)
      .single();

    if (markedError && markedError.code !== 'PGRST116') {
      console.error('Error checking existing attendance status for selected session:', markedError.message);
      setErrorMessage('Error checking attendance status.');
      setAttendanceStatus('error');
    } else if (marked) {
      setAttendanceStatus('marked');
      toast.success('You have already marked attendance for this session!', { id: 'already-marked' });
    } else {
      setAttendanceStatus(null); // Ready to mark attendance
    }
    setLoading(false);
  }, [supabase]); // Depend on supabase client

  // Effect hook to fetch data on component mount and subscribe to real-time updates
  useEffect(() => {
    fetchAllAndCategorizeSessions(); // Initial data fetch

    let sessionChannel: RealtimeChannel | null = null;
    // Subscribe to real-time updates for the current session's status if one is selected
    if (currentSession?.id) {
      sessionChannel = supabase
        .channel(`session_status_${currentSession.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${currentSession.id}` },
          (payload) => {
            // If the attendance becomes inactive for the current session, reset and refetch
            if (payload.new.is_attendance_active === false) {
              setCurrentSession(null);
              setErrorMessage('The attendance session has been closed by the lecturer.');
              setAttendanceStatus(null);
              toast.error('Attendance session ended!', { id: 'session-ended' });
              fetchAllAndCategorizeSessions(); // Re-fetch all sessions to update the list
            }
          }
        )
        .subscribe();
    }

    // Cleanup function: remove the real-time channel when the component unmounts or currentSession changes
    return () => {
      if (sessionChannel) {
        supabase.removeChannel(sessionChannel);
      }
    };
  }, [supabase, currentSession?.id, fetchAllAndCategorizeSessions]); // Re-run effect if supabase, currentSession.id, or fetch function changes

  /**
   * Callback function for when a QR code is successfully scanned.
   * Calls the server action to mark attendance.
   */
  const handleQrScanSuccess = async (scannedText: string) => {
    if (!currentSession || !currentSession.id) {
      setErrorMessage('No active session selected to mark attendance for. Please select a session.');
      setAttendanceStatus('error');
      toast.error('No session selected!', { id: 'mark-attendance-fail' });
      return;
    }

    setAttendanceStatus('pending'); // Show pending state
    setErrorMessage(null); // Clear any old errors
    toast.loading('Marking attendance...', { id: 'mark-attendance' }); // Show loading toast

    // Call the server action to mark attendance
    const result = await markAttendance(currentSession.id, scannedText);

    if (result.success) {
      setAttendanceStatus('marked'); // Set status to marked
      toast.success('Attendance marked successfully!', { id: 'mark-attendance' }); // Show success toast
      fetchAllAndCategorizeSessions(); // Re-fetch sessions to update last marked attendance and session states
    } else {
      setAttendanceStatus('error'); // Set status to error
      setErrorMessage(result.error || 'Failed to mark attendance.'); // Display error message
      toast.error(result.error || 'Failed to mark attendance!', { id: 'mark-attendance' }); // Show error toast
    }
  };

  // --- Render logic based on component state ---

  // Loading state UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-800 antialiased font-sans">
        <p className="text-center text-gray-600 text-lg animate-pulse" aria-live="polite">Loading sessions and your enrollments...</p>
      </div>
    );
  }

  // Attendance marked success UI
  if (attendanceStatus === 'marked') {
    return (
      <div className="min-h-screen bg-gray-50 antialiased font-sans flex flex-col items-center justify-center py-8 px-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full" role="status" aria-live="assertive">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold mt-4 text-green-700">Attendance Recorded!</h2>
          <p className="mt-2 text-gray-700">You are present for <span className="font-semibold">{currentSession?.course_intakes?.courses?.title || 'the selected session'}</span>.</p>
          <button
            onClick={() => { setCurrentSession(null); setAttendanceStatus(null); fetchAllAndCategorizeSessions(); }}
            className="mt-6 px-6 py-3 bg-[#329EE8] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:ring-opacity-75 transition-all duration-200 ease-in-out"
          >
            View Other Sessions
          </button>
        </div>
      </div>
    );
  }

  // Error state UI
  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gray-50 antialiased font-sans flex flex-col items-center justify-center py-8 px-4">
        <div className="text-center p-8 bg-red-50 rounded-xl shadow-lg max-w-md w-full border-l-4 border-red-500" role="alert" aria-live="assertive">
          <p className="text-lg font-semibold text-red-700">Error:</p>
          <p className="text-red-600 mt-2">{errorMessage}</p>
          <button
            onClick={fetchAllAndCategorizeSessions}
            className="mt-4 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // UI for marking attendance (QR Scanner view) if a session is selected
  if (currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans flex flex-col items-center py-8 px-4">
        <div className="container mx-auto p-4 max-w-2xl text-center bg-white rounded-xl shadow-lg w-full">
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
            Mark Attendance for {currentSession.course_intakes?.courses?.title || 'Selected Course'} - {currentSession.course_intakes?.intakes?.label || 'No Intake Label'}
          </h2>
          <p className="text-center text-gray-700 mb-6">
            Scan the QR code displayed by your lecturer.
          </p>

          {attendanceStatus === 'pending' ? (
            <div className="text-center p-4 bg-blue-50 rounded-lg" aria-live="polite">
              <p className="text-blue-700 font-medium animate-pulse">Scanning... Please wait.</p>
            </div>
          ) : (
            <QRCodeScanner onScanCompleteAction={handleQrScanSuccess} />
          )}
          <button
            onClick={() => { setCurrentSession(null); setAttendanceStatus(null); }}
            className="mt-6 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out"
          >
            Go Back to Session List
          </button>
        </div>
      </div>
    );
  }

  // Default UI for session selection
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans flex flex-col items-center py-8 px-4">
      <div className="container mx-auto p-4 max-w-3xl md:max-w-4xl lg:max-w-5xl text-center bg-white rounded-xl shadow-lg w-full">
        <div className="p-8" role="status" aria-live="polite">
          <h2 className="text-3xl font-bold mt-4 text-blue-800">
            {userName ? `Hello, ${userName}!` : 'Hello!'}
            <br />
            Select a Session
          </h2>
          <p className="text-blue-700 mt-2 mb-6">
            Please choose a session below to mark your attendance.
          </p>

          {/* Display last marked attendance if available */}
          {lastMarkedAttendance && (
            <div className="mt-8 p-4 bg-blue-100 rounded-lg text-left border-l-4 border-[#329EE8]">
              <p className="font-semibold text-blue-800">Your Last Attendance:</p>
              <p className="text-blue-700">
                You marked attendance for <span className="font-bold">{lastMarkedAttendance.courseTitle}</span>
                <br /> on <span className="font-bold">{lastMarkedAttendance.markedAt}</span>.
              </p>
            </div>
          )}

          {/* Display enrolled courses */}
          {enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="mt-6 text-left p-4 bg-gray-50 rounded-lg shadow-inner">
              <p className="text-gray-700 font-semibold mb-2">You are enrolled in:</p>
              <ul className="list-disc list-inside text-gray-600">
                {enrolledCourses.map(course => (
                  <li key={course.id} className="py-1">
                    <span className="font-medium text-gray-800">{course.code}:</span> {course.title}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                You can also check your course schedule for upcoming session times.
              </p>
            </div>
          ) : (
            <p className="mt-4 text-gray-600 p-4 bg-gray-50 rounded-lg shadow-inner">
              It looks like you are not currently enrolled in any courses.
            </p>
          )}

          {/* Display available sessions (active, upcoming, closed) */}
          {allSessions && allSessions.length > 0 ? (
            <div className="mt-8 text-left">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Available Sessions:</h3>
              <ul className="space-y-4">
                {allSessions.map(session => (
                  <li key={session.id} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-grow">
                      <p className="font-bold text-xl text-gray-900 leading-tight">
                        {session.course_intakes?.courses?.title || 'Unknown Course'} ({session.course_intakes?.courses?.code || 'N/A'})
                      </p>
                      <p className="text-md text-gray-700 mt-1">
                        Intake: {session.course_intakes?.intakes?.label || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {session.attendance_window_start ? (
                          <>
                            {new Date(session.attendance_window_start).toLocaleString()} - {session.attendance_window_end ? new Date(session.attendance_window_end).toLocaleTimeString() : 'Open-ended'}
                          </>
                        ) : (
                          'Attendance window information not available.'
                        )}
                      </p>
                      <p className={`font-semibold mt-2 ${
                        session.status === 'active' ? 'text-green-600' :
                        session.status === 'upcoming' ? 'text-blue-600' :
                        'text-red-600'
                      }`}>
                        Status: {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </p>
                    </div>
                    {session.status === 'active' && (
                      <button
                        onClick={() => handleSessionSelect(session)}
                        className="mt-4 sm:mt-0 px-5 py-2 bg-[#329EE8] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:ring-opacity-75 transition-colors duration-200 ease-in-out flex-shrink-0"
                      >
                        Mark Attendance
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-8 text-gray-600 p-4 bg-gray-50 rounded-lg shadow-inner">No active, upcoming, or recently closed sessions found for your enrolled courses.</p>
          )}

          <button
            onClick={fetchAllAndCategorizeSessions}
            className="mt-6 px-6 py-3 bg-[#329EE8] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:ring-opacity-75 transition-all duration-200 ease-in-out"
          >
            Refresh Sessions
          </button>
        </div>
      </div>
    </div>
  );
}
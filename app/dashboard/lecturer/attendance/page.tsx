// app/lecturer/attendance/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Assuming you have a Badge component
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component
import { Database } from '@/types/supabase'; // Assuming these types are correct

// Extend the Session type to include optional course and intake details for listing
type SessionListItem = Database['public']['Tables']['sessions']['Row'] & {
  courses?: Database['public']['Tables']['courses']['Row'] & {
    intakes?: Database['public']['Tables']['intakes']['Row'] | null;
  } | null;
};

export default function LecturerAttendanceDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState<boolean>(true);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturerSessions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      setError('Authentication failed. Please log in.');
      setLoading(false);
      return;
    }

    // Fetch courses taught by this lecturer to filter sessions
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id')
      .eq('lecturer_id', user.id);

    if (coursesError) {
      console.error('Error fetching lecturer courses:', coursesError);
      setError('Failed to load your assigned courses.');
      setLoading(false);
      return;
    }

    const lecturerCourseIds = courses?.map(c => c.id) || [];

    if (lecturerCourseIds.length === 0) {
      setSessions([]);
      setError('You are not assigned to any courses. No sessions to display.');
      setLoading(false);
      return;
    }

    // Fetch sessions for the courses taught by this lecturer
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        *,
        courses(
          id, title, code,
          intakes(id, label)
        )
      `)
      .in('course_id', lecturerCourseIds)
      .order('session_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      setError('Failed to load your sessions.');
    } else {
      setSessions(sessionsData as SessionListItem[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLecturerSessions();
  }, [fetchLecturerSessions]);

  const handleManageSession = (sessionId: string) => {
    router.push(`/lecturer/attendance/${sessionId}`);
  };

  const handleCreateNewSession = () => {
    router.push('/dashboard/lecturer/attendance/create');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Your Sessions</h2>
        <Button 
          onClick={handleCreateNewSession} 
          className="bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors duration-200 ease-in-out"
        >
          Create New Session
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => ( // Show 3 skeleton cards
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg shadow-md max-w-md mx-auto border border-red-200">
          <p className="text-lg font-semibold text-red-700">Error Loading Sessions:</p>
          <p className="text-red-600 mt-2">{error}</p>
          <Button onClick={fetchLecturerSessions} className="mt-6 bg-blue-500 hover:bg-blue-600 text-white">
            Retry Loading Sessions
          </Button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center p-10 bg-blue-50 rounded-lg shadow-md max-w-lg mx-auto border border-blue-200">
          <p className="text-2xl font-bold text-blue-700 mb-3">No Sessions Found</p>
          <p className="text-blue-600 text-lg">It looks like you haven not created any sessions yet.</p>
          <p className="text-blue-600 mt-2 mb-6">Click the button below to get started!</p>
          <Button onClick={handleCreateNewSession} className="bg-green-600 hover:bg-green-700 text-white shadow-lg transition-transform transform hover:scale-105">
            Create Your First Session
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {session.courses?.title || 'Unknown Course'} ({session.courses?.code || 'N/A'})
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Intake: {session.courses?.intakes?.label || 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {new Date(session.session_date).toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span> {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                </p>
                <div className="pt-2">
                  <Badge variant={session.is_attendance_active ? 'default' : 'secondary'} className={`${session.is_attendance_active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'} text-white`}>
                    {session.is_attendance_active ? 'Attendance Active' : 'Attendance Inactive'}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleManageSession(session.id)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-200 ease-in-out"
                >
                  Manage Attendance
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
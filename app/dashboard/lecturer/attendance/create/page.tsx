// app/lecturer/attendance/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { createSession } from '../actions';
import { Database } from '@/types/supabase';

// Define types for fetched data
type IntakeRow = Database['public']['Tables']['intakes']['Row'];
type CourseRow = Database['public']['Tables']['courses']['Row']; // CourseRow now just reflects the table columns

export default function CreateSessionPage() {
  const router = useRouter();

  const [intakes, setIntakes] = useState<IntakeRow[]>([]);
  const [selectedIntakeId, setSelectedIntakeId] = useState<string>('');
  const [courses, setCourses] = useState<CourseRow[]>([]); // These will be the courses filtered by intake (from API)
  const [courseId, setCourseId] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingIntakes, setIsFetchingIntakes] = useState<boolean>(true);
  const [isFetchingCourses, setIsFetchingCourses] = useState<boolean>(false); // Separate loading for courses

  // Effect to fetch all intakes once
  useEffect(() => {
    async function fetchIntakes() {
      setIsFetchingIntakes(true);
      try {
        const intakesResponse = await fetch('/api/intakes');
        if (!intakesResponse.ok) {
          throw new Error(`HTTP error! status: ${intakesResponse.status}`);
        }
        const intakesData: IntakeRow[] = await intakesResponse.json();
        setIntakes(intakesData || []);
      } catch (error) {
        console.error('Error fetching intakes:', error);
        toast.error('Failed to load intakes.');
      } finally {
        setIsFetchingIntakes(false);
      }
    }
    fetchIntakes();
  }, []);

  // Effect to fetch courses based on selected intake
  useEffect(() => {
    async function fetchCoursesForIntake() {
      if (!selectedIntakeId) {
        setCourses([]); // Clear courses if no intake is selected
        setCourseId('');
        return;
      }

      setIsFetchingCourses(true);
      setCourseId(''); // Reset selected course when intake changes
      try {
        // Call the new /api/courses route with the selected intakeId
        const coursesResponse = await fetch(`/api/courses?intake_id=${selectedIntakeId}`);
        if (!coursesResponse.ok) {
          throw new Error(`HTTP error! status: ${coursesResponse.status}`);
        }
        const coursesData: CourseRow[] = await coursesResponse.json();
        setCourses(coursesData || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses for selected intake.');
      } finally {
        setIsFetchingCourses(false);
      }
    }

    fetchCoursesForIntake();
  }, [selectedIntakeId]); // Re-run whenever the selected intake changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Creating session...', { id: 'create-session-toast' });

    if (!selectedIntakeId || !courseId || !sessionDate || !startTime || !endTime) {
      toast.error('Please fill in all fields (Intake, Course, Date, Times).', { id: 'create-session-toast' });
      setIsLoading(false);
      return;
    }

    // Call the Server Action with the newly added intakeId
    const result = await createSession(courseId, selectedIntakeId, sessionDate, startTime, endTime);

    if (result.success && result.sessionId) {
      toast.success('Session created successfully!', { id: 'create-session-toast' });
      router.push(`/dashboard/lecturer/attendance/${result.sessionId}`);
    } else {
      toast.error(`Failed to create session: ${result.error}`, { id: 'create-session-toast' });
      console.error('Error creating session:', result.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">Create New Session</h2>

      {(isFetchingIntakes || isFetchingCourses) ? (
        <div className="text-center text-gray-600 dark:text-white">Loading data...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Intake Selection */}
          <div>
            <Label className='dark:text-white' htmlFor="intake">Intake</Label>
            <select
              id="intake"
              value={selectedIntakeId}
              onChange={(e) => setSelectedIntakeId(e.target.value)}
              className="dark:text-white mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              required
            >
              <option className='text-gray-600' value="">Select an Intake</option>
              {intakes.map((intake) => (
                <option className='text-gray-500' key={intake.id} value={intake.id}>
                  {intake.label}
                </option>
              ))}
            </select>
            {intakes.length === 0 && (
                <p className="text-sm text-red-500 mt-1 dark:text-white">No intakes available. Please create intakes first.</p>
            )}
          </div>

          {/* Course Selection (filtered by intake, now from API) */}
          <div className='dark:text-white'>
            <Label htmlFor="course">Course</Label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mdark:text-white t-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              required
              disabled={!selectedIntakeId || courses.length === 0 || isFetchingCourses}
            >
              <option className='text-gray-500' value="">Select a Course</option>
              {courses.map((course) => (
                <option className='text-gray-500' key={course.id} value={course.id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
            {!selectedIntakeId && <p className="text-sm text-gray-500 mt-1 dark:text-white">Select an intake to see courses.</p>}
            {selectedIntakeId && courses.length === 0 && !isFetchingCourses && (
                <p className="text-sm text-red-500 mt-1 dark:text-white">No courses found for this intake.</p>
            )}
            {isFetchingCourses && selectedIntakeId && (
                <p className="text-sm text-gray-500 mt-1 dark:text-white">Loading courses...</p>
            )}
          </div>

          <div className='dark:text-white'>
            <Label htmlFor="sessionDate" >Session Date</Label>
            <Input
              type="date"
              id="sessionDate"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 ">
            <div className='dark:text-white'>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className='dark:text-white'>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading || isFetchingIntakes || isFetchingCourses || courses.length === 0 || !selectedIntakeId} className="w-full">
            {isLoading ? 'Creating...' : 'Create Session'}
          </Button>
        </form>
      )}
    </div>
  );
}
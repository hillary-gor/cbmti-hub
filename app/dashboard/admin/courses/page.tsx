'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllCourses } from './actions'; // Correct path to actions
import { toast } from 'sonner';
import Link from 'next/link';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';

// Import the CourseData interface directly from actions.ts
import type { CourseData } from './actions';

// The local 'Course' interface is no longer needed as we'll use CourseData
// interface Course {
//   id: string;
//   title: string;
//   description: string;
//   long_description: string | null;
//   duration_weeks: number;
//   level: 'Certificate' | 'Diploma' | 'Degree';
//   price_string: string | null;
//   image_url: string | null;
//   features: string[] | null;
//   next_intake_date: string | null;
//   icon_name: string | null;
//   is_featured: boolean;
//   code: string | null;
//   department_id: string | null;
//   has_attachment: boolean | null;
//   lecturer_id: string | null;
//   intake_id: string | null;
// }

export default function AdminCoursesPage() {
  // Use CourseData for the state type
  const [allCourses, setAllCourses] = useState<CourseData[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Function to fetch all courses for the list
  const fetchAllCourses = async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const { data, error } = await getAllCourses(); // Call the getAllCourses server action
      if (error) {
        throw new Error(error);
      }
      // Ensure data is an array before setting state
      setAllCourses(data || []);
    } catch (err: unknown) { // Changed 'any' to 'unknown'
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setCoursesError(errorMessage || 'Failed to fetch courses for listing.');
      console.error('Error fetching all courses:', err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    // Fetch courses when the component mounts
    fetchAllCourses();
  }, []); // Empty dependency array means it runs once on mount

  // Placeholder for delete functionality (you'd implement a server action for this)
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      // Implement your delete server action here (e.g., await deleteCourse(courseId);)
      // For now, it's just a toast message.
      toast.info(`Delete functionality for course ${courseId} not yet implemented.`);
      // If delete was successful, re-fetch the list:
      // fetchAllCourses();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-900">Manage Courses</h1>

        {/* Link to Create New Course */}
        <div className="flex justify-center">
          <Link href="/dashboard/admin/courses/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" /> Create New Course
            </Button>
          </Link>
        </div>

        {/* List Existing Courses Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Existing Courses</CardTitle>
            <CardDescription>View, edit, or delete medical training courses.</CardDescription>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <p className="text-center text-gray-600">Loading courses...</p>
            ) : coursesError ? (
              <p className="text-center text-red-500">{coursesError}</p>
            ) : allCourses.length === 0 ? (
              <p className="text-center text-gray-600">No courses found. Click &quot;Create New Course&quot; above to add one.</p>
            ) : (
              <div className="space-y-4">
                {allCourses.map((course) => (
                  // Ensure course.id is defined before using it as key
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <span className="font-medium text-gray-800">{course.title} ({course.level}) - {course.code}</span>
                    <div className="flex space-x-2">
                      {/* Ensure course.id is defined before using in Link href */}
                      {course.id && (
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Button variant="outline" size="icon" className="text-blue-600 hover:bg-blue-100">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {course.id && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteCourse(course.id as string)} // Cast to string if id is used as argument
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

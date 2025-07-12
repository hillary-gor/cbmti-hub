"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getAllCourses } from "./actions";
import { toast } from "sonner";
import Link from "next/link";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";

import type { CourseData } from "./actions";

export default function AdminCoursesPage() {
  const [allCourses, setAllCourses] = useState<CourseData[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  const fetchAllCourses = async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const { data, error } = await getAllCourses();
      if (error) {
        throw new Error(error);
      }
      setAllCourses(data || []);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setCoursesError(errorMessage || "Failed to fetch courses for listing.");
      console.error("Error fetching all courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleDeleteCourse = async (courseId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      toast.info(
        `Delete functionality for course ${courseId} not yet implemented.`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Manage Courses
        </h1>

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
            <CardTitle className="text-2xl font-bold">
              Existing Courses
            </CardTitle>
            <CardDescription>
              View, edit, or delete medical training courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <p className="text-center text-gray-600">Loading courses...</p>
            ) : coursesError ? (
              <p className="text-center text-red-500">{coursesError}</p>
            ) : allCourses.length === 0 ? (
              <p className="text-center text-gray-600">
                No courses found. Click &quot;Create New Course&quot; above to
                add one.
              </p>
            ) : (
              <div className="space-y-4">
                {allCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                  >
                    <span className="font-medium text-gray-800">
                      {course.title} ({course.level}) - {course.code}
                    </span>
                    <div className="flex space-x-2">
                      {course.id && (
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-100"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      {course.id && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            handleDeleteCourse(course.id as string)
                          }
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

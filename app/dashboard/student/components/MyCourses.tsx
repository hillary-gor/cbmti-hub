"use client";

export function MyCourses({
  courses,
}: {
  courses: { name: string; code: string; instructor?: string }[];
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">📘 My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div
            key={course.code}
            className="p-4 border rounded-xl bg-white dark:bg-zinc-900"
          >
            <h3 className="font-bold">{course.name}</h3>
            <p className="text-sm text-muted-foreground">{course.code}</p>
            {course.instructor && (
              <p className="text-xs">Instructor: {course.instructor}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

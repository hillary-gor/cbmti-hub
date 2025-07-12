import { getCourseById } from "../../actions";
import CourseEditForm from "./course-edit-form";
import { notFound } from "next/navigation";

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = params;
  const { data: course, error } = await getCourseById(id);

  if (error) {
    console.error("Error fetching course for editing:", error);
    return (
      <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-red-700 text-xl">Error loading course: {error}</p>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Edit Course
        </h1>
        <CourseEditForm initialData={course} />
      </div>
    </div>
  );
}

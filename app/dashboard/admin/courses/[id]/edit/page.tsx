import { getCourseById } from '../../actions'; // Import the server action to fetch course
import CourseEditForm from './course-edit-form'; // Import the client component form
import { notFound } from 'next/navigation'; // For handling cases where course is not found

// Removed the duplicate Course interface definition here.
// The CourseData interface from '@/app/admin/actions' will be used instead.
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
//   next_intake_date: string | null; // Date string (YYYY-MM-DD)
//   icon_name: string | null;
//   is_featured: boolean;
//   code: string | null;
//   department_id: string | null;
//   has_attachment: boolean | null;
//   lecturer_id: string | null;
//   intake_id: string | null;
// }

interface EditCoursePageProps {
  params: {
    id: string; // The course ID from the URL
  };
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = params;
  // getCourseById already returns data as CourseData type
  const { data: course, error } = await getCourseById(id);

  if (error) {
    console.error('Error fetching course for editing:', error);
    // You might want a more user-friendly error page here
    return (
      <div className="min-h-screen bg-red-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <p className="text-red-700 text-xl">Error loading course: {error}</p>
      </div>
    );
  }

  if (!course) {
    notFound(); // Next.js built-in to render a 404 page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center text-gray-900">Edit Course</h1>
        {/* Pass the fetched course data to the client component form */}
        <CourseEditForm initialData={course} />
      </div>
    </div>
  );
}

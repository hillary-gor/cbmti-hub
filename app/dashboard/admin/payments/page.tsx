// app/dashboard/admin/payments/page.tsx

import { Suspense } from 'react';
import AdminPaymentDashboard from './components/AdminPaymentDashboard';
import {
  getIntakes,
  getCourses,
  getStudentsByIntakeAndCourse
} from './actions';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error('Error fetching user:', authError.message);
    redirect('/login');
  }

  if (!user) {
    redirect('/login');
  }

  const [intakes, courses, students] = await Promise.all([
    getIntakes(),
    getCourses(),
    getStudentsByIntakeAndCourse()
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="text-center text-xl font-semibold text-gray-700">
            Loading Admin Dashboard...
          </div>
        </div>
      }
    >
      <AdminPaymentDashboard
        initialIntakes={intakes}
        initialCourses={courses}
        initialStudents={students}
      />
    </Suspense>
  );
}

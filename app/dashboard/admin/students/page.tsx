import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

type Student = {
  id: string;
  reg_number: string;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at: string;
};

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const { data: students, error } = await supabase
    .from('students')
    .select('id, reg_number, full_name, email, phone, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ADMIN_STUDENTS_ERROR]', error.message);
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">All Students</h1>
        <p className="text-sm text-muted-foreground">
          List of all registered students in the system
        </p>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 font-semibold">Reg Number</th>
              <th className="px-4 py-2 font-semibold">Full Name</th>
              <th className="px-4 py-2 font-semibold">Email</th>
              <th className="px-4 py-2 font-semibold">Phone</th>
              <th className="px-4 py-2 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s: Student) => (
              <tr key={s.id} className="border-t hover:bg-muted/30 transition">
                <td className="px-4 py-2">{s.reg_number}</td>
                <td className="px-4 py-2">{s.full_name ?? '—'}</td>
                <td className="px-4 py-2">{s.email ?? '—'}</td>
                <td className="px-4 py-2">{s.phone ?? '—'}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

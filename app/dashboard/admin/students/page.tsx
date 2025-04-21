import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { fetchAllStudents } from './actions'

type StudentRow = {
  id: string
  full_name: string | null
  reg_number: string | null
  status: string
  enrollment_year: number
  serial_no: number | null
  courses?: {
    code: string | null
  }[]
  intakes?: {
    label: string | null
  }[]
}

export default async function AdminStudentsPage() {
  let students: StudentRow[] = []

  try {
    const data = await fetchAllStudents()
    students = (data ?? []) as StudentRow[]
  } catch (err) {
    console.error('[ADMIN_STUDENTS_ERROR]', err)
    return <div className="text-red-600">⚠️ Failed to load students</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Students</h1>
        <Button asChild>
          <Link href="/dashboard/admin/students/new">➕ Add Student</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Reg Number</th>
              <th className="p-3 border">Course</th>
              <th className="p-3 border">Intake</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.full_name ?? '—'}</td>
                  <td className="p-3">{s.reg_number ?? `CBMTI-${s.serial_no}`}</td>
                  <td className="p-3">{s.courses?.[0]?.code ?? '—'}</td>
                  <td className="p-3">{s.intakes?.[0]?.label ?? '—'}</td>
                  <td className="p-3 capitalize">{s.status}</td>
                  <td className="p-3">
                    <Link
                      href={`/dashboard/admin/students/${s.id}/edit`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

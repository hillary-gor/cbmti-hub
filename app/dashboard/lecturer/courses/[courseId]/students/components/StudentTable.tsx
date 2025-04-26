// app/dashboard/lecturer/courses/[courseId]/students/components/StudentTable.tsx
import Image from "next/image"

type Props = {
  enrollments: {
    id: string
    enrolled_at: string
    student: {
      id: string
      full_name: string
      email: string
      avatar_url?: string
    }
  }[]
}

export function StudentTable({ enrollments }: Props) {
  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-2">Student</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Enrolled</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map(({ id, enrolled_at, student }) => (
            <tr key={id} className="border-t hover:bg-accent transition">
              <td className="px-4 py-2 flex items-center gap-2">
                {student.avatar_url && (
                  <Image
                    src={student.avatar_url}
                    alt={student.full_name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                )}
                {student.full_name}
              </td>
              <td className="px-4 py-2">{student.email}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(enrolled_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

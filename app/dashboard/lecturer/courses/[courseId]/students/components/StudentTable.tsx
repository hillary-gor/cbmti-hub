import { formatDate } from "@/lib/utils"

type Enrollment = {
  id: string
  joined_at: string
  students: {
    id: string
    full_name: string
    email: string
  }[]
}

export function StudentTable({ enrollments }: { enrollments: Enrollment[] }) {
  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enroll) => {
            const student = enroll.students?.[0]
            return (
              <tr key={enroll.id} className="border-t">
                <td className="p-3">{student?.full_name}</td>
                <td className="p-3 text-muted-foreground">{student?.email}</td>
                <td className="p-3 text-muted-foreground">
                  {formatDate(enroll.joined_at)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

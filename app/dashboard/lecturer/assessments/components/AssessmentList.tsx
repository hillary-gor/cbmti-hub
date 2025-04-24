import { formatDate } from "@/lib/utils"

type Assessment = {
  id: string
  title: string
  type: "quiz" | "assignment" | "exam"
  due_date: string
  description?: string
}

export function AssessmentList({ assessments }: { assessments: Assessment[] }) {
  return (
    <div className="space-y-4">
      {assessments.length === 0 && (
        <p className="text-muted-foreground text-sm">No assessments yet.</p>
      )}

      {assessments.map((a) => (
        <div
          key={a.id}
          className="rounded-lg border p-4 shadow-sm bg-background space-y-1"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase">
              {a.type}
            </span>
          </div>
          {a.description && (
            <p className="text-sm text-muted-foreground">{a.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Due: {formatDate(a.due_date)}
          </p>
        </div>
      ))}
    </div>
  )
}

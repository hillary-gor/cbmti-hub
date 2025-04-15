export function CourseCard({
  title,
  code,
  description,
}: {
  title: string
  code: string
  description?: string
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm bg-background">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{code}</p>
      {description && <p className="text-sm mt-2">{description}</p>}
    </div>
  )
}

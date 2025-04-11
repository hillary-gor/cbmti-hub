'use client'

export function TranscriptSection({ transcript }: { transcript: { gpa: number, file_url: string } | null }) {
  if (!transcript) return null

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-2">🧾 Transcript</h2>
      <p className="text-sm mb-2">GPA: <strong>{transcript.gpa}</strong></p>
      <a href={transcript.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
        Download PDF
      </a>
    </div>
  )
}

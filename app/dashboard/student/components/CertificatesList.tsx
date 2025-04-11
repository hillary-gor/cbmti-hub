'use client'

export function CertificatesList({ certificates }: { certificates: { title: string, file_url: string }[] }) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">📄 Certificates</h2>
      <ul className="space-y-2">
        {certificates.map((cert, i) => (
          <li key={i}>
            <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {cert.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

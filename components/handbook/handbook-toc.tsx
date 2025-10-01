"use client"

export function HandbookTableOfContents() {
  const sections = [
    { title: "Welcome Message", href: "#welcome" },
    { title: "Vision & Mission", href: "#vision-mission" },
    { title: "Core Values", href: "#core-values" },
    { title: "Code of Conduct", href: "#code-of-conduct" },
    { title: "Admission Policy", href: "#admission" },
    { title: "Examination Policy", href: "#examination" },
    { title: "Academic Integrity", href: "#academic-integrity" },
  ]

  return (
    <div className="space-y-2">
      <p className="font-medium">On this page</p>
      <ul className="m-0 list-none space-y-2">
        {sections.map((section) => (
          <li key={section.href} className="mt-0 pt-2">
            <a
              href={section.href}
              className="inline-block text-sm text-muted-foreground no-underline transition-colors hover:text-foreground"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

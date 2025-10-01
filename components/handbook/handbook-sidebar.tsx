"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  items?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    href: "#getting-started",
    items: [
      { title: "Welcome Message", href: "#welcome" },
      { title: "Vision & Mission", href: "#vision-mission" },
      { title: "Core Values", href: "#core-values" },
    ],
  },
  {
    title: "Organization",
    href: "#organization",
    items: [
      { title: "Accreditation", href: "#accreditation" },
      { title: "Departments", href: "#departments" },
      { title: "Facilities", href: "#facilities" },
      { title: "Communication", href: "#communication" },
    ],
  },
  {
    title: "Code of Conduct",
    href: "#code-of-conduct",
    items: [
      { title: "Prohibited Conduct", href: "#prohibited-conduct" },
      { title: "Dishonesty", href: "#dishonesty" },
      { title: "Harassment", href: "#harassment" },
    ],
  },
  {
    title: "Policies",
    href: "#policies",
    items: [
      { title: "Admission Policy", href: "#admission" },
      { title: "Fee Policy", href: "#fees" },
      { title: "Attendance", href: "#attendance" },
      { title: "Examination Policy", href: "#examination" },
      { title: "Dress Code", href: "#dress-code" },
      { title: "Student Attachment", href: "#attachment" },
      { title: "Deferment", href: "#deferment" },
      { title: "Suspension", href: "#suspension" },
      { title: "Expulsion", href: "#expulsion" },
    ],
  },
  {
    title: "Academic Integrity",
    href: "#academic-integrity",
    items: [
      { title: "Academic Dishonesty", href: "#academic-dishonesty" },
      { title: "Plagiarism", href: "#plagiarism" },
      { title: "Penalties", href: "#penalties" },
    ],
  },
  {
    title: "Student Services",
    href: "#student-services",
    items: [
      { title: "Health Management", href: "#health" },
      { title: "Mentorship", href: "#mentorship" },
      { title: "Student Records", href: "#records" },
      { title: "Graduation", href: "#graduation" },
    ],
  },
]

export function HandbookSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [openSections, setOpenSections] = useState<string[]>(["Getting Started"])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  return (
    <div className="w-full py-6 pr-6 lg:py-8">
      <nav className="space-y-1">
        {navigation.map((item) => (
          <div key={item.title}>
            <button
              onClick={() => toggleSection(item.title)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <span>{item.title}</span>
              {item.items && (
                <ChevronRight
                  className={cn("h-4 w-4 transition-transform", openSections.includes(item.title) && "rotate-90")}
                />
              )}
            </button>
            {item.items && openSections.includes(item.title) && (
              <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                {item.items.map((subItem) => (
                  <a
                    key={subItem.href}
                    href={subItem.href}
                    onClick={onNavigate}
                    className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

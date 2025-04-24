"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { lecturerNav } from "./nav"
import { LucideIcon, icons } from "lucide-react"

function LecturerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-muted border-r hidden md:block">
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">Lecturer Panel</h2>
        <nav aria-label="Lecturer navigation">
          <ul className="space-y-1">
            {lecturerNav.map(({ label, href, icon }) => {
              const isActive = pathname.startsWith(href)
              const Icon = icons[icon as keyof typeof icons] as LucideIcon

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default LecturerSidebar

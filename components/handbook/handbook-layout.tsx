"use client"

import type React from "react"
import { useState } from "react"
import { HandbookSidebar } from "./handbook-sidebar"
import { HandbookTableOfContents } from "./handbook-toc"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HandbookLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        
        {/* Sidebar */}
        <aside
          className={`fixed top-0 z-30 h-screen w-full shrink-0 overflow-y-auto border-r border-border bg-background md:sticky md:top-0 md:block ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          {/* Close button only visible on mobile */}
          <div className="flex justify-end p-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <HandbookSidebar onNavigate={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content */}
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          {/* Mobile menu button (top left) */}
          <div className="mb-4 flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          <div className="mx-auto w-full min-w-0 max-w-3xl">{children}</div>

          {/* Table of Contents */}
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-y-auto pt-10">
              <HandbookTableOfContents />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

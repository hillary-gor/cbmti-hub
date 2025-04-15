// app/dashboard/lecturer/layout.tsx
import { getUserAndRole } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LecturerSidebar } from "./components/LecturerSidebar"
import type { ReactNode } from "react"

export default async function LecturerLayout({ children }: { children: ReactNode }) {
  const user = await getUserAndRole()

  if (!user || user.role !== "lecturer") {
    redirect("/dashboard/students") // or throw new Error("Unauthorized")
  }

  return (
    <div className="flex min-h-screen">
      <LecturerSidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

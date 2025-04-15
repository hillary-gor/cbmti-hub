// app/dashboard/lecturer/overview/components/StatCard.tsx
"use client"

import { motion } from "framer-motion"
import { LucideIcon, BookOpen, Users, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  users: Users,
  "file-check": FileCheck,
}

export function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: number
  icon: keyof typeof iconMap
  color: "blue" | "emerald" | "amber"
}) {
  const Icon = iconMap[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl border p-6 shadow-sm bg-white dark:bg-muted",
        "flex items-center gap-4"
      )}
    >
      <div
        className={cn(
          "p-3 rounded-full text-white",
          color === "blue" && "bg-blue-600",
          color === "emerald" && "bg-emerald-600",
          color === "amber" && "bg-amber-500"
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </motion.div>
  )
}

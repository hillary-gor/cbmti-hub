// app/dashboard/student/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getUserAndRole } from "@/lib/auth";

export default function StudentDashboardPage() {
  const [user, setUser] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getUserAndRole();
      if (u?.role === "student") {
        setUser(u);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">
        Welcome {user?.full_name ?? "Student"} 🎓
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        This is your CBMTI student dashboard. Use the sidebar to navigate your profile, grades, fees, and more.
      </p>
    </div>
  );
}

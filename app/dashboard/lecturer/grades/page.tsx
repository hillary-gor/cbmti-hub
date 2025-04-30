"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Intake = { id: string; label: string; status?: string };
type Course = { id: string; title: string; code: string };

export default function LecturerGradesPage() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedIntake, setSelectedIntake] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const router = useRouter();

  // Fetch intakes on load
  useEffect(() => {
    fetch("/api/intakes")
      .then((res) => res.json())
      .then((data) => {
        setIntakes(data);
        const active = data.find((i: Intake) => i.status === "active");
        if (active) setSelectedIntake(active.id);
      });
  }, []);

  // Fetch courses when intake changes
  useEffect(() => {
    if (!selectedIntake) return;
    fetch(`/api/courses?intake_id=${selectedIntake}`)
      .then((res) => res.json())
      .then(setCourses);
  }, [selectedIntake]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse && selectedIntake) {
      router.push(`/dashboard/lecturer/grades/manage?course_id=${selectedCourse}&intake_id=${selectedIntake}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0049AB]">Grade Entry</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Intake</label>
          <select
            value={selectedIntake}
            onChange={(e) => setSelectedIntake(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
          >
            <option value="">-- Choose intake --</option>
            {intakes.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label} {i.status === "active" ? "(Current)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
            disabled={!courses.length}
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
          >
            <option value="">-- Choose course --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-full mt-2">
          <button type="submit" className="bg-[#0049AB] text-white px-4 py-2 rounded hover:opacity-90">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

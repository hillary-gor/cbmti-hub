"use client";

import { useFormState } from "react-dom";
import { updateCourse } from "./actions";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Department = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  code: string;
  name: string;
  department_id: string;
  departments: Department;
};

type FormState = {
  error?: string;
};

export default function EditCoursePage() {
  const { id } = useParams();

  const [formState, formAction] = useFormState(
    (_prev: FormState, formData: FormData) =>
      updateCourse(id as string, formData),
    { error: "" },
  );

  const [course, setCourse] = useState<Course | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/admin/supabase-courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
        setDepartments([data.departments]);
      } catch (err) {
        console.error("❌ Failed to load course:", err);
      }
    }

    fetchCourse();
  }, [id]);

  if (!course) return <p className="text-center py-6">Loading course...</p>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Course</h1>

      <form action={formAction} className="space-y-4">
        <Input name="code" defaultValue={course.code} required />
        <Input name="name" defaultValue={course.name} required />

        <select
          name="department_id"
          defaultValue={course.department_id}
          className="w-full p-2 border rounded"
        >
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <Button type="submit">💾 Save Changes</Button>

        {formState?.error && (
          <p className="text-red-600 text-sm mt-2">❌ {formState.error}</p>
        )}
      </form>
    </div>
  );
}

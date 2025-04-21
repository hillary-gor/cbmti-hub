'use client'

import { useFormState } from 'react-dom'
import { useEffect, useState } from 'react'
import { createStudent } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormState = {
  error?: string
  success?: boolean
}

export default function NewStudentPage() {
  const [formState, formAction] = useFormState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      return await createStudent(formData)
    },
    { error: undefined, success: false }
  )

  const [courses, setCourses] = useState<{ id: string; code: string }[]>([])
  const [intakes, setIntakes] = useState<{ id: string; label: string }[]>([])

  useEffect(() => {
    async function fetchData() {
      const resCourses = await fetch('/api/supabase-courses')
      const resIntakes = await fetch('/api/supabase-intakes')
      const courses = await resCourses.json()
      const intakes = await resIntakes.json()
      setCourses(courses)
      setIntakes(intakes)
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Add New Student</h1>

      <form action={formAction} className="space-y-4">
        <Input name="full_name" placeholder="Full Name" required />

        <select name="course_id" required className="w-full border p-2 rounded">
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.code}
            </option>
          ))}
        </select>

        <select name="intake_id" required className="w-full border p-2 rounded">
          <option value="">Select Intake</option>
          {intakes.map((i) => (
            <option key={i.id} value={i.id}>
              {i.label}
            </option>
          ))}
        </select>

        <Input
          type="number"
          name="enrollment_year"
          placeholder="2025"
          required
        />

        <select name="status" required className="w-full border p-2 rounded">
          <option value="active">Active</option>
          <option value="graduated">Graduated</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="suspended">Suspended</option>
        </select>

        <Button type="submit">➕ Create Student</Button>

        {formState?.error && (
          <p className="text-red-600 text-sm mt-2">❌ {formState.error}</p>
        )}
        {formState?.success && (
          <p className="text-green-600 text-sm mt-2">✅ Student created!</p>
        )}
      </form>
    </div>
  )
}

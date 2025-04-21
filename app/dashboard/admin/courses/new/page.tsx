'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react' // ✅ useActionState from 'react'
import { createCourse } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormState = {
  error?: string
  success?: boolean
}

type Department = {
  id: string
  name: string
}

export default function NewCoursePage() {
  const [departments, setDepartments] = useState<Department[]>([])

  const [formState, formAction] = useActionState(
    async (_prevState: FormState, formData: FormData): Promise<FormState> => {
      return await createCourse(formData)
    },
    { error: undefined, success: false }
  )

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch('/api/admin/supabase-departments')
        if (!res.ok) throw new Error('Failed to fetch departments')
        const data: Department[] = await res.json()
        setDepartments(data)
      } catch (err) {
        console.error('❌ Failed to fetch departments:', err)
        setDepartments([])
      }
    }

    fetchDepartments()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Add New Course</h1>

      <form action={formAction} className="space-y-4">
        <Input name="code" placeholder="e.g., NUR-101" required />
        <Input name="name" placeholder="e.g., Introduction to Nursing" required />

        <select
          name="department_id"
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <Button type="submit">➕ Create Course</Button>

        {formState?.error && (
          <p className="text-red-600 text-sm mt-2">❌ {formState.error}</p>
        )}
        {formState?.success && (
          <p className="text-green-600 text-sm mt-2">✅ Course created!</p>
        )}
      </form>
    </div>
  )
}

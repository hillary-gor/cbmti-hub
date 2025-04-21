'use client'

import { useFormState } from 'react-dom'
import { updateStudent } from './actions'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Define proper types
type Student = {
  id: string
  full_name: string
  course_id: string
  intake_id: string
  enrollment_year: number
  status: 'active' | 'graduated' | 'withdrawn' | 'suspended'
  courses?: { id: string; code: string }
  intakes?: { id: string; label: string }
}

type FormState = {
  error?: string
  success?: boolean
}

export default function EditStudentPage() {
  const params = useParams()
  const studentId = typeof params.id === 'string' ? params.id : ''

  // Use correct types in useFormState
  const [formState, formAction] = useFormState(
    async (
      prev: FormState,
      formData: FormData
    ): Promise<FormState> => updateStudent(studentId, formData),
    { error: undefined, success: false }
  )

  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `/api/supabase-students?id=eq.${studentId}&select=*,courses(id,code),intakes(id,label)`,
        { cache: 'no-store' }
      )
      const json = await res.json()
      const record = json?.[0]

      if (record) {
        setStudent(record)
      }
    }

    fetchData()
  }, [studentId])

  if (!student) return <p className="text-center py-6">Loading...</p>

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit Student</h1>

      <form action={formAction} className="space-y-4">
        <Input name="full_name" defaultValue={student.full_name} required />

        <select
          name="course_id"
          defaultValue={student.course_id}
          className="w-full p-2 border rounded"
        >
          {student.courses && (
            <option value={student.courses.id}>{student.courses.code}</option>
          )}
        </select>

        <select
          name="intake_id"
          defaultValue={student.intake_id}
          className="w-full p-2 border rounded"
        >
          {student.intakes && (
            <option value={student.intakes.id}>{student.intakes.label}</option>
          )}
        </select>

        <Input
          type="number"
          name="enrollment_year"
          defaultValue={student.enrollment_year}
          required
        />

        <select
          name="status"
          defaultValue={student.status}
          className="w-full p-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="graduated">Graduated</option>
          <option value="withdrawn">Withdrawn</option>
          <option value="suspended">Suspended</option>
        </select>

        <Button type="submit">💾 Save Changes</Button>

        {/* No more TS2339 errors here */}
        {formState?.error && <p className="text-red-600">❌ {formState.error}</p>}
        {formState?.success && <p className="text-green-600">Student updated!</p>}
      </form>
    </div>
  )
}

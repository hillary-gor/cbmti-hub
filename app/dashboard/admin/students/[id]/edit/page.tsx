'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useActionState } from 'react'
import { updateStudent } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type Student = {
  id: string
  full_name: string
  course_id: string
  intake_id: string
  enrollment_year: number
  status: 'active' | 'graduated' | 'withdrawn' | 'suspended'
}

type Option = {
  id: string
  code?: string
  label?: string
}

type FormState = {
  error?: string
  success?: boolean
}

export default function EditStudentPage() {
  const params = useParams()
  const studentId = typeof params.id === 'string' ? params.id : ''

  const [formState, formAction] = useActionState(
    async (_: FormState, formData: FormData): Promise<FormState> => {
      return await updateStudent(studentId, formData)
    },
    { error: undefined, success: false }
  )

  const [student, setStudent] = useState<Student | null>(null)
  const [courses, setCourses] = useState<Option[]>([])
  const [intakes, setIntakes] = useState<Option[]>([])

  useEffect(() => {
    async function fetchData() {
      const [studentRes, coursesRes, intakesRes] = await Promise.all([
        fetch(`/api/supabase-data?type=students&id=${studentId}`, { cache: 'no-store' }),
        fetch('/api/supabase-data?type=courses', { cache: 'no-store' }),
        fetch('/api/supabase-data?type=intakes', { cache: 'no-store' }),
      ])

      const [studentData, courseData, intakeData] = await Promise.all([
        studentRes.json(),
        coursesRes.json(),
        intakesRes.json(),
      ])

      setStudent(studentData ?? null)
      setCourses(courseData ?? [])
      setIntakes(intakeData ?? [])
    }

    fetchData()
  }, [studentId])

  if (!student) {
    return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading student details...</p>
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-8 text-center">Edit Student</h1>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" defaultValue={student.full_name} required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="course_id">Course</Label>
              <select
                id="course_id"
                name="course_id"
                defaultValue={student.course_id}
                required
                className="w-full rounded border border-gray-300 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="intake_id">Intake</Label>
              <select
                id="intake_id"
                name="intake_id"
                defaultValue={student.intake_id}
                required
                className="w-full rounded border border-gray-300 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select an intake
                </option>
                {intakes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="enrollment_year">Enrollment Year</Label>
              <Input
                id="enrollment_year"
                type="number"
                name="enrollment_year"
                defaultValue={student.enrollment_year}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={student.status}
                required
                className="w-full rounded border border-gray-300 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="withdrawn">Withdrawn</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              💾 Save Changes
            </Button>

            {formState?.error && (
              <p className="text-red-600 text-sm mt-2">❌ {formState.error}</p>
            )}
            {formState?.success && (
              <p className="text-green-600 text-sm mt-2">✅ Student updated!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

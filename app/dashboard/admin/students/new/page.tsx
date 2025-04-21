'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { fetchEligibleUsers, createStudent } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserSelect } from './UserSelect'

type UserOption = { id: string; email: string; full_name: string }
type CourseOption = { id: string; code: string }
type IntakeOption = { id: string; label: string }

export default function AddStudentPage() {
  const [users, setUsers] = useState<UserOption[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [intakes, setIntakes] = useState<IntakeOption[]>([])

  const [formState, formAction] = useActionState(createStudent, { success: false })

  useEffect(() => {
    async function load() {
      const [userData, courseData, intakeData] = await Promise.all([
        fetchEligibleUsers(),
        fetch('/api/supabase-data?type=courses').then((r) => r.json()),
        fetch('/api/supabase-data?type=intakes').then((r) => r.json()),
      ])
      setUsers(userData)
      setCourses(courseData)
      setIntakes(intakeData)
    }

    load()
  }, [])

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Assign New Student</h1>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <form action={formAction} className="space-y-4">
            {/* ✅ Client-safe User Selector with <input name="user_id" /> */}
            <UserSelect users={users} />

            {/* Course Select */}
            <div>
              <Label htmlFor="course_id">Course</Label>
              <select name="course_id" required className="w-full p-2 border rounded">
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Intake Select */}
            <div>
              <Label htmlFor="intake_id">Intake</Label>
              <select name="intake_id" required className="w-full p-2 border rounded">
                <option value="">Select intake</option>
                {intakes.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Enrollment Year */}
            <div>
              <Label htmlFor="enrollment_year">Enrollment Year</Label>
              <Input
                name="enrollment_year"
                type="number"
                required
                defaultValue={new Date().getFullYear()}
              />
            </div>

            <Button type="submit">💾 Assign Student</Button>

            {formState.success && (
              <p className="text-green-600 text-sm mt-2">✅ Student assigned successfully!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

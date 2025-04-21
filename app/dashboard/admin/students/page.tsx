'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fetchStudents } from './actions'

type StudentRow = {
  id: string
  full_name: string | null
  reg_number: string | null
  status: string
  enrollment_year: number
  serial_no: number | null
  created_at: string
  courses?: { code: string | null }[]
  intakes?: { label: string | null }[]
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [search, setSearch] = useState('')
  const [courseId, setCourseId] = useState('')
  const [intakeId, setIntakeId] = useState('')

  const limit = 20

  async function loadStudents({ append = false } = {}) {
    setLoading(true)

    try {
      const last = append ? students[students.length - 1] : undefined
      const data = await fetchStudents({
        search,
        courseId,
        intakeId,
        limit,
        cursor: last?.created_at,
      })

      if (append) {
        setStudents((prev) => [...prev, ...data])
      } else {
        setStudents(data)
      }

      setHasMore(data.length === limit)
    } catch (err) {
      console.error('[LOAD_STUDENTS_ERROR]', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, courseId, intakeId])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <h1 className="text-2xl font-semibold">All Students</h1>
        <Button asChild>
          <Link href="/dashboard/admin/students/new">➕ Add Student</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Input
          placeholder="Search name or reg no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">All Courses</option>
          {/* fetch & map course options here */}
        </select>
        <select
          className="p-2 border rounded"
          value={intakeId}
          onChange={(e) => setIntakeId(e.target.value)}
        >
          <option value="">All Intakes</option>
          {/* fetch & map intake options here */}
        </select>
        <Button onClick={() => loadStudents()}>🔍 Apply Filters</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto rounded border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Reg Number</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Intake</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-muted/50 transition">
                    <td className="px-4 py-3">{s.full_name ?? '—'}</td>
                    <td className="px-4 py-3">{s.reg_number ?? `CBMTI-${s.serial_no}`}</td>
                    <td className="px-4 py-3">{s.courses?.[0]?.code ?? '—'}</td>
                    <td className="px-4 py-3">{s.intakes?.[0]?.label ?? '—'}</td>
                    <td className="px-4 py-3 capitalize">{s.status}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/admin/students/${s.id}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {hasMore && (
        <div className="text-center pt-4">
          <Button onClick={() => loadStudents({ append: true })} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}

'use client'

import { inviteUser } from '@/app/dashboard/admin/students/invite/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof schema>

export default function InviteStudentPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const [result, setResult] = useState<{ success?: boolean; error?: string; email?: string }>({})

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData()
    formData.append('email', values.email)

    const res = await inviteUser(formData)
    setResult(res)

    if (res.success) reset()
  }

  return (
    <div className="max-w-md mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Invite a Student</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : 'Send Invite'}
        </Button>

        {result.error && (
          <p className="text-red-600 text-sm mt-2">{result.error}</p>
        )}

        {result.success && (
          <p className="text-green-600 text-sm mt-2">
            ✅ Invite sent to <strong>{result.email}</strong>
          </p>
        )}
      </form>
    </div>
  )
}

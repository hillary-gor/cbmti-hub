'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { createIntake } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type FormState = {
  error?: string
  success?: boolean
}

export default function NewIntakePage() {
  const [selectedDate, setSelectedDate] = useState<string>('')

  const [formState, formAction] = useActionState(
    async (_state: FormState, formData: FormData): Promise<FormState> => {
      if (selectedDate) {
        formData.set('opens_on', selectedDate)
      }
      return await createIntake(formData)
    },
    { error: '', success: false }
  )

  return (
    <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Add New Intake</h1>

      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Opening Date
          </label>
          <Input
            type="date"
            name="opens_on"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <Button type="submit">➕ Create Intake</Button>

        {formState?.error && (
          <p className="text-red-600 text-sm mt-2">❌ {formState.error}</p>
        )}
        {formState?.success && (
          <p className="text-green-600 text-sm mt-2">✅ Intake created!</p>
        )}
      </form>
    </div>
  )
}

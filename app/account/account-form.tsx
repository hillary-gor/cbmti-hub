'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Avatar from './avatar'

const schema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

type FormData = z.infer<typeof schema>

type Props = {
  userId: string
  email: string
}

export default function AccountForm({ userId, email }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [avatarTouched, setAvatarTouched] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function loadUserProfile() {
      const { data } = await supabase
        .from('users')
        .select('full_name, username, avatar_url, profile_completed')
        .eq('id', userId)
        .single()

      if (data) {
        setValue('fullname', data.full_name ?? '')
        setValue('username', data.username ?? '')
        setAvatarUrl(data.avatar_url ?? '')
      }
    }

    loadUserProfile()
  }, [supabase, userId, setValue])

  const onSubmit = async (data: FormData) => {
    if (!avatarUrl) {
      setAvatarTouched(true)
      return
    }

    await supabase.from('users').upsert({
      id: userId,
      full_name: data.fullname,
      username: data.username,
      avatar_url: avatarUrl,
      profile_completed: true,
      updated_at: new Date().toISOString(),
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const role = user?.user_metadata?.role || 'student'

    const { data: userRecord } = await supabase
      .from('users')
      .select('profile_completed')
      .eq('id', userId)
      .single()

    if (!userRecord?.profile_completed) {
      router.push(`/dashboard/${role}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Account Settings</h2>

      <div className="flex justify-center mb-6">
        <Avatar
          uid={userId}
          url={avatarUrl}
          size={120}
          avatarChangedCallback={(path) => {
            setAvatarUrl(path)
            setAvatarTouched(true)
          }}
        />
      </div>

      {!avatarUrl && avatarTouched && (
        <p className="text-red-500 text-sm text-center -mt-4 mb-4">Avatar is required.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full mt-1 p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            type="text"
            {...register('fullname')}
            className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            {...register('username')}
            className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
        >
          {isSubmitting ? 'Saving...' : 'Update Profile'}
        </button>
      </form>

      <form action="/auth/signout" method="post" className="mt-4">
        <button
          type="submit"
          className="w-full bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Sign Out
        </button>
      </form>
    </div>
  )
}

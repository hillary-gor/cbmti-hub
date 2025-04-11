'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/client'
import Avatar from './avatar'
import PasswordInputWithLiveCheck from '@/components/form/PasswordInputWithLiveCheck'

const schema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(60, 'Password must be at most 60 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Must contain a special symbol'),
})

type FormData = z.infer<typeof schema>

type Props = {
  userId: string
  email: string
}

export default function AccountForm({ userId, email }: Props) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    async function loadUserProfile() {
      const { data } = await supabase
        .from('users')
        .select('full_name, username, website, avatar_url')
        .eq('id', userId)
        .single()

      if (data) {
        setValue('fullname', data.full_name ?? '')
        setValue('username', data.username ?? '')
        setValue('website', data.website ?? '')
        setAvatarUrl(data.avatar_url ?? '')
      }
    }

    loadUserProfile()
  }, [supabase, userId, setValue])

  const onSubmit = async (data: FormData) => {
    await supabase.from('users').upsert({
      id: userId,
      full_name: data.fullname,
      username: data.username,
      website: data.website,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })

    alert('Profile updated!')
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Account Settings</h2>

      <div className="flex justify-center mb-6">
        <Avatar
          uid={userId}
          url={avatarUrl}
          size={120}
          avatarChangedCallback={(path) => setAvatarUrl(path)}
        />
      </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
          <input
            type="url"
            {...register('website')}
            className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
          {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <PasswordInputWithLiveCheck
            value={watch('password') || ''}
            onValidPassword={(valid, val) => setValue('password', val)}
            error={errors.password?.message}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
        >
          {isSubmitting ? 'Saving...' : 'Update Profile'}
        </button>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full mt-2 bg-gray-200 dark:bg-gray-700 dark:text-white text-gray-800 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Sign Out
          </button>
        </form>
      </form>
    </div>
  )
}

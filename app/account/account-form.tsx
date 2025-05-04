'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, useTransition } from 'react'
import { updateUserProfile } from './actions'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import Cropper, { Area } from 'react-easy-crop'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import getCroppedImg from '@/lib/cropImage'

const schema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    gender: z.enum(['Male', 'Female', 'Other'], {
      required_error: 'Gender is required',
    }),
    dob: z.string().min(1, 'Date of birth is required'),
    location: z.string().min(2, 'Location is required'),
    role: z.enum(['student', 'admin', 'lecturer'], {
      required_error: 'Role is required',
    }),
    user_id: z.string().optional(),
    avatar_url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if ((data.role === 'admin' || data.role === 'lecturer') && !data.user_id) {
      ctx.addIssue({
        path: ['user_id'],
        code: z.ZodIssueCode.custom,
        message: 'User ID is required for Admin or Lecturer',
      })
    }
  })

type FormData = z.infer<typeof schema>

const countries = [
  'Kenya',
  'Uganda',
  'Tanzania',
  'Nigeria',
  'South Africa',
  'Ethiopia',
  'Rwanda',
  'Ghana',
  'Zambia',
  'Malawi',
]

export function AccountForm({ userId }: { userId: string }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'student',
    },
  })

  const role = useWatch({ control, name: 'role' })
  const supabase = createClient()

  const handleAvatarUpload = async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setCropDialogOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
    const filePath = `avatars/${userId}_${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, croppedBlob, {
        contentType: 'image/jpeg',
        upsert: true,
      })

    if (uploadError) {
      alert('Upload failed.')
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data?.publicUrl
    setValue('avatar_url', publicUrl, { shouldValidate: true })
    setAvatarPreview(publicUrl)
    setCropDialogOpen(false)
  }

  const onSubmit = (data: FormData) => {
    startTransition(() => updateUserProfile(userId, data))
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full px-6 py-12 max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-10 text-center">
          Complete Your Profile
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Name */}
          <div>
            <label className="font-semibold">Full Name</label>
            <input {...register('full_name')} className="input" />
            {errors.full_name && (
              <p className="text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold">Phone</label>
            <input {...register('phone')} className="input" />
            {errors.phone && (
              <p className="text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="font-semibold">Gender</label>
            <select {...register('gender')} className="input">
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500">{errors.gender.message}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="font-semibold">Date of Birth</label>
            <input type="date" {...register('dob')} className="input" />
            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="font-semibold">Country</label>
            <select {...register('location')} className="input">
              <option value="">Select country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="font-semibold">Role</label>
            <select {...register('role')} className="input">
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* User ID */}
          {(role === 'admin' || role === 'lecturer') && (
            <div>
              <label className="font-semibold">User ID (Staff ID)</label>
              <input {...register('user_id')} className="input" />
              {errors.user_id && (
                <p className="text-red-500">{errors.user_id.message}</p>
              )}
            </div>
          )}

          {/* Avatar Upload */}
          <div>
            <label className="font-semibold">Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleAvatarUpload(file)
              }}
              className="input"
            />
            {avatarPreview && (
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                width={96}
                height={96}
                className="rounded-full mt-2 object-cover"
              />
            )}
            {errors.avatar_url && (
              <p className="text-red-500">{errors.avatar_url.message}</p>
            )}
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-full text-lg"
          >
            {isPending ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </form>

      {/* === Crop Dialog === */}
      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="p-0 overflow-hidden max-w-md w-[90vw] sm:w-full">
          <div className="relative w-full h-[min(80vw,400px)] bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
                cropShape="round"
                showGrid={false}
                objectFit="horizontal-cover"
              />
            )}
          </div>

          <div className="px-4 py-3 bg-background">
            <label htmlFor="zoom" className="text-sm font-medium block mb-1">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="flex justify-between p-4 border-t bg-background">
            <Button variant="outline" size="sm" onClick={() => setCropDialogOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button size="sm" onClick={handleCropConfirm} className="w-1/2">
              Crop & Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

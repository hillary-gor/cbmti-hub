import { getUserAndRole } from '@/lib/auth'
import { getSettingsData, updateUserSettings } from './actions'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const user = await getUserAndRole()
  if (!user) redirect('/login')

  const profile = await getSettingsData(user.id)
  if (!profile) redirect('/unauthorized')

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action={updateUserSettings} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            defaultValue={profile.full_name}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            name="phone"
            defaultValue={profile.phone || ''}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  )
}

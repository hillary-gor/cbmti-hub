import { createClient } from '@/utils/supabase/server'

export async function getPublicAssetUrl(path: string): Promise<string> {
  const supabase = await createClient()
  const { data } = supabase.storage.from('assets').getPublicUrl(path)
  return data.publicUrl
}

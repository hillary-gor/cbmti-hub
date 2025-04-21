import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('courses')
    .select('id, code, name, department_id, departments(id, name)')
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('[ADMIN_API_COURSE_ERROR]', error)
    return NextResponse.json(null, { status: 500 })
  }

  return NextResponse.json(data)
}

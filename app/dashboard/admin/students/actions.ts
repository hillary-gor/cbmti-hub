'use server'

import { createClient } from '@/utils/supabase/server'

export async function fetchAllStudents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      full_name,
      reg_number,
      status,
      enrollment_year,
      serial_no,
      courses(code),
      intakes(label)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

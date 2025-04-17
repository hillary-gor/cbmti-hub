import { createClient } from '@/utils/supabase/server';

export async function getRegisterPageData(intakeId: string) {
  const supabase = await createClient();

  const { data: intake } = await supabase
    .from('intakes')
    .select('id, label, opens_on, closes_on')
    .eq('id', intakeId)
    .single();

  const { data: students } = await supabase
    .from('students')
    .select('id, reg_number')
    .order('reg_number', { ascending: true });

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title')
    .order('title', { ascending: true });

  return { intake, students: students ?? [], courses: courses ?? [] };
}

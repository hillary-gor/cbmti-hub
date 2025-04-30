import { createClient } from "@/utils/supabase/server";
import EditProfileClient from "./EditProfileClient";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p className="p-6 text-red-600">Not logged in</p>;

  const { data: student } = await supabase
    .from("students")
    .select(`
      full_name,
      phone_number,
      address,
      town_city,
      postal_code,
      nationality,
      national_id,
      marital_status,
      religion
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!student) return <p className="p-6 text-red-600">Profile not found.</p>;

  return <EditProfileClient initialData={student} />;
}

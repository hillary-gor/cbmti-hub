"use server";

import { createClient } from "@/utils/supabase/server";

// Types for user and lecturer
type UserWithRole = {
  id: string;
  full_name: string;
  role: "student" | "admin" | "lecturer";
  avatar_url?: string | null;
};

type Lecturer = {
  id: string;
  department: string;
  user_id: string;
};

// Authenticated user + role + avatar_url
export async function getUserAndRole(): Promise<UserWithRole | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, role, avatar_url")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data as UserWithRole;
}

// Fetch lecturer data by user_id
export async function getLecturer(): Promise<Lecturer | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("lecturers")
    .select("id, department, user_id")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return data as Lecturer;
}

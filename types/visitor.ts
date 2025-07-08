export type Visitor = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  purpose: string | null;
  description: string | null;
  person_to_visit: string | null;
  check_in_time: string;
  check_out_time: string | null;
  created_at: string;
  updated_at: string;
};
// src/types/custom.ts

// These base interfaces represent the direct table structures for courses and intakes
// (You might already have these or similar in your auto-generated supabase.ts,
// but re-defining them here ensures our custom types are self-contained for clarity).
export interface Course {
  id: string;
  title: string;
  code: string;
  // Include other relevant course properties if fetched in your queries
  lecturer_id: string; // Add if you select this
}

export interface Intake {
  id: string;
  label: string;
  year: number; // Example: Add other properties if relevant
  month: string;
  status: 'active' | 'archived' | 'upcoming';
  // Include other relevant intake properties if fetched in your queries
}

// Represents the joined data structure from the `course_intakes` junction table
// This is how the `course_intakes` part of your Supabase query will look
export interface CourseIntakeJoined {
  id: string; // The ID of the entry in public.course_intakes
  course_id: string; // Foreign key to public.courses
  intake_id: string; // Foreign key to public.intakes
  
  // These are the nested relations from your Supabase query:
  courses: Course | null; // Joined Course details
  intakes: Intake | null; // Joined Intake details
}

// This is your main custom type for a Session,
// now correctly structured to match the Supabase query's nested joins.
export interface SessionWithCourseAndIntake {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  is_attendance_active: boolean;
  attendance_window_start: string | null;
  attendance_window_end: string | null;
  last_qr_code_value: string | null;
  last_qr_code_generated_at: string | null;
  lecturer_id: string; // This column is on your sessions table
  course_intake_id: string; // The foreign key linking to the course_intakes junction table

  // This property holds the joined data from the course_intakes table,
  // which in turn contains the nested course and intake details.
  course_intakes: CourseIntakeJoined | null;
}
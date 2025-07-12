'use server';

import { createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Define the expected shape of the data for a course
export interface CourseData { // Added 'export' keyword here
  id?: string; // ID is optional for creation, but required for update
  title: string;
  description: string;
  long_description?: string | null; // Made nullable
  duration_weeks: number;
  level: 'Certificate' | 'Diploma' | 'Degree';
  price_string?: string | null; // Made nullable
  image_url?: string | null; // Made nullable
  features?: string[] | null; // Made nullable
  next_intake_date?: string | null; // Date string (YYYY-MM-DD), made nullable
  icon_name?: string | null; // Made nullable
  is_featured?: boolean;
  code?: string | null; // Made nullable
  department_id?: string | null; // Made nullable
  has_attachment?: boolean | null; // Made nullable
  lecturer_id?: string | null; // Made nullable
  intake_id?: string | null; // Made nullable
}

// Updated IntakeData interface to match the 'intakes' table schema
interface IntakeData {
  label: string;
  opens_on: string;
  closes_on: string;
  status: string;
  year?: number;
  month?: string;
}

export async function createCourse(formData: FormData) {
  const supabaseAdmin = await createAdminClient();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const long_description = formData.get('long_description') as string | undefined;
  const duration_weeks = parseInt(formData.get('duration_weeks') as string);
  const level = formData.get('level') as CourseData['level'];
  const price_string = formData.get('price_string') as string | undefined;
  const image_url = formData.get('image_url') as string | undefined;
  const featuresString = formData.get('features') as string | undefined;
  // Removed next_intake_date as it's no longer in the form
  const icon_name = formData.get('icon_name') as string | undefined;
  const is_featured = formData.get('is_featured') === 'on';
  const code = formData.get('code') as string; // NEW: Get course code from form

  const featuresArray = featuresString ? featuresString.split(',').map(f => f.trim()) : [];

  // Added 'code' to required fields for validation
  if (!title || !description || isNaN(duration_weeks) || !level || !code) {
    return { success: false, message: 'Missing required course fields (Title, Description, Duration, Level, Code).' };
  }

  const courseData: Omit<CourseData, 'id'> = { // Omit id for creation
    title,
    description,
    duration_weeks,
    level,
    is_featured,
    features: featuresArray.length > 0 ? featuresArray : null,
    long_description: long_description || null,
    price_string: price_string || null,
    image_url: image_url || null,
    next_intake_date: null, // Set to null as it's removed from the form
    icon_name: icon_name || null,
    code: code, // NEW: Include code in the courseData object
  };

  try {
    const { error } = await supabaseAdmin
      .from('courses')
      .insert([courseData])
      .select();

    if (error) {
      console.error('Error inserting course:', error);
      return { success: false, message: `Failed to create course: ${error.message}` };
    }

    revalidatePath('/');
    revalidatePath('/courses');

    return { success: true, message: 'Course created successfully!' };
  } catch (e: unknown) {
    console.error('Unexpected error creating course:', e);
    // Safely access message property
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { success: false, message: errorMessage };
  }
}

export async function createIntake(formData: FormData) {
  const supabaseAdmin = await createAdminClient();

  const label = formData.get('label') as string;
  const opens_on = formData.get('opens_on') as string;
  const closes_on = formData.get('closes_on') as string;
  const status = formData.get('status') as string;
  const courseIdsString = formData.get('courseIds') as string;

  if (!label || !opens_on || !closes_on || !status) {
    return { success: false, message: 'Missing required intake fields.' };
  }

  let courseIds: string[] = [];
  try {
    if (courseIdsString) {
      courseIds = JSON.parse(courseIdsString);
      if (!Array.isArray(courseIds)) {
        throw new Error('courseIds is not a valid array.');
      }
    }
  } catch (e: unknown) {
    console.error('Error parsing courseIds:', e);
    const errorMessage = e instanceof Error ? e.message : 'Invalid course selection data.';
    return { success: false, message: errorMessage };
  }

  const intakeData: IntakeData = {
    label,
    opens_on,
    closes_on,
    status,
  };

  try {
    const { data: newIntake, error: intakeError } = await supabaseAdmin
      .from('intakes')
      .insert([intakeData])
      .select('id');

    if (intakeError) {
      console.error('Error inserting intake:', intakeError);
      return { success: false, message: `Failed to create intake: ${intakeError.message}` };
    }

    const newIntakeId = newIntake?.[0]?.id;

    if (newIntakeId && courseIds.length > 0) {
      const courseIntakeAssociations = courseIds.map(courseId => ({
        intake_id: newIntakeId,
        course_id: courseId,
      }));

      const { error: associationError } = await supabaseAdmin
        .from('course_intakes')
        .insert(courseIntakeAssociations);

      if (associationError) {
        console.error('Error inserting course-intake associations:', associationError);
        return { success: false, message: `Intake created, but failed to associate courses: ${associationError.message}` };
      }
    }

    revalidatePath('/intakes');
    revalidatePath('/');

    return { success: true, message: 'Intake created and courses associated successfully!' };
  } catch (e: unknown) {
    console.error('Unexpected error creating intake:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred while creating the intake.';
    return { success: false, message: errorMessage };
  }
}

// Server Action to fetch a single course by ID
export async function getCourseById(id: string): Promise<{ data: CourseData | null; error: string | null }> {
  const supabaseAdmin = await createAdminClient();
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*') // Select all columns for editing
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course by ID:', error);
      return { data: null, error: error.message };
    }

    return { data: data as CourseData, error: null };
  } catch (e: unknown) {
    console.error('Unexpected error in getCourseById:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { data: null, error: errorMessage };
  }
}

// NEW: Server Action to fetch all courses
export async function getAllCourses(): Promise<{ data: CourseData[] | null; error: string | null }> {
  const supabaseAdmin = await createAdminClient();
  try {
    const { data, error } = await supabaseAdmin
      .from('courses')
      .select('*') // Select all columns
      .order('title', { ascending: true }); // Order by title for display

    if (error) {
      console.error('Error fetching all courses:', error);
      return { data: null, error: error.message };
    }

    return { data: data as CourseData[], error: null };
  } catch (e: unknown) {
    console.error('Unexpected error in getAllCourses:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { data: null, error: errorMessage };
  }
}


// Server Action to update an existing course
export async function updateCourse(formData: FormData) {
  const supabaseAdmin = await createAdminClient();

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const long_description = formData.get('long_description') as string | undefined;
  const duration_weeks = parseInt(formData.get('duration_weeks') as string);
  const level = formData.get('level') as CourseData['level'];
  const price_string = formData.get('price_string') as string | undefined;
  const image_url = formData.get('image_url') as string | undefined;
  const featuresString = formData.get('features') as string | undefined;
  // Removed next_intake_date as it's no longer in the form
  const icon_name = formData.get('icon_name') as string | undefined;
  const is_featured = formData.get('is_featured') === 'on';
  const code = formData.get('code') as string; // NEW: Get course code from form

  const featuresArray = featuresString ? featuresString.split(',').map(f => f.trim()) : [];

  if (!id || !title || !description || isNaN(duration_weeks) || !level || !code) {
    return { success: false, message: 'Missing required course fields for update.' };
  }

  const courseData: Omit<CourseData, 'id'> = { // Omit id for the update payload
    title,
    description,
    duration_weeks,
    level,
    is_featured,
    features: featuresArray.length > 0 ? featuresArray : null,
    long_description: long_description || null,
    price_string: price_string || null,
    image_url: image_url || null,
    next_intake_date: null, // Set to null as it's removed from the form
    icon_name: icon_name || null,
    code: code, // NEW: Include code in the courseData object
  };

  try {
    const { error } = await supabaseAdmin
      .from('courses')
      .update(courseData)
      .eq('id', id) // Crucial: specify which record to update
      .select();

    if (error) {
      console.error('Error updating course:', error);
      return { success: false, message: `Failed to update course: ${error.message}` };
    }

    revalidatePath('/'); // Revalidate homepage if featured status changed
    revalidatePath(`/courses/${id}`); // Revalidate specific course page
    revalidatePath('/courses'); // Revalidate all courses page

    return { success: true, message: 'Course updated successfully!' };
  } catch (e: unknown) {
    console.error('Unexpected error updating course:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred while updating the course.';
    return { success: false, message: errorMessage };
  }
}

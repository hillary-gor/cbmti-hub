"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Server configuration error: Supabase URL or Anon Key environment variables are missing.",
  );
  throw new Error("Server configuration error: Supabase credentials missing.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Application {
  id: string;
  selected_intake_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string | null;
  date_of_birth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO-SAY";
  nationality: string;
  id_number: string;
  high_school_attended: string;
  year_of_final_exam: string;
  qualifying_grade: string;
  additional_qualifications: string | null;
  has_disability: boolean;
  disability_type: string | null;
  disability_details: string | null;
  application_status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "UNDER_REVIEW"
    | null;
  submitted_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  notes?: string | null;

  intake_title?: string;
  intake_month?: string;
  intake_year?: number | null;
}

interface RawApplicationData {
  id: string;
  selected_intake_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string | null;
  date_of_birth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO-SAY";
  nationality: string;
  id_number: string;
  high_school_attended: string;
  year_of_final_exam: string;
  qualifying_grade: string;
  additional_qualifications: string | null;
  has_disability: boolean;
  disability_type: string | null;
  disability_details: string | null;
  application_status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "UNDER_REVIEW"
    | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
  intakes: {
    course_title: string;
    month: string;
    year: number;
  } | null;
}

export async function fetchApplications() {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, intakes (course_title, month, year)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch applications error:", error.message);
      return {
        success: false,
        data: null,
        message: "Failed to fetch applications",
      };
    }

    const rawApplications = data as RawApplicationData[];

    if (!Array.isArray(rawApplications)) {
      console.error(
        "Supabase returned non-array data for applications:",
        rawApplications,
      );
      return {
        success: false,
        data: null,
        message: "Invalid data format received from server.",
      };
    }

    const applications: Application[] = rawApplications.map(
      (app: RawApplicationData) => ({
        id: app.id,
        selected_intake_id: app.selected_intake_id,
        first_name: app.first_name,
        last_name: app.last_name,
        email: app.email,
        phone: app.phone,
        address: app.address,
        city: app.city,
        postal_code: app.postal_code,
        date_of_birth: app.date_of_birth,
        gender: app.gender,
        nationality: app.nationality,
        id_number: app.id_number,
        high_school_attended: app.high_school_attended,
        year_of_final_exam: app.year_of_final_exam,
        qualifying_grade: app.qualifying_grade,
        additional_qualifications: app.additional_qualifications,
        has_disability: app.has_disability,
        disability_type: app.disability_type,
        disability_details: app.disability_details,
        application_status: app.application_status,
        submitted_at: app.created_at,
        reviewed_at: app.reviewed_at,
        reviewed_by: app.reviewed_by,
        notes: app.notes,
        intake_title: app.intakes?.course_title || "N/A",
        intake_month: app.intakes?.month || "N/A",
        intake_year: app.intakes?.year || null,
      }),
    );

    return {
      success: true,
      data: applications,
      message: "Applications fetched successfully",
    };
  } catch (error) {
    console.error(
      "An unexpected error occurred during fetchApplications:",
      error,
    );
    return {
      success: false,
      data: null,
      message: "An unexpected server error occurred. Please try again.",
    };
  }
}

export async function updateApplicationStatus(formData: FormData) {
  try {
    const applicationId = formData.get("applicationId") as string;
    const action = formData.get("action") as string;
    const notes = formData.get("notes") as string;

    const statusMap: {
      [key: string]: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
    } = {
      approve: "APPROVED",
      reject: "REJECTED",
      review: "UNDER_REVIEW",
    };

    const newStatus = statusMap[action];

    if (!newStatus) {
      return {
        success: false,
        message: "Invalid action provided.",
      };
    }

    const { error } = await supabase
      .from("applications")
      .update({
        application_status: newStatus,
        notes: notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: "Admin User",
      })
      .eq("id", applicationId);

    if (error) {
      console.error("Supabase update application status error:", error.message);
      return {
        success: false,
        message: "Failed to update application status",
      };
    }

    return {
      success: true,
      message: `Application ${action}d successfully`,
    };
  } catch (error) {
    console.error(
      "An unexpected error occurred during updateApplicationStatus:",
      error,
    );
    return {
      success: false,
      message: "An unexpected server error occurred. Please try again.",
    };
  }
}

export async function getApplicationById(id: string) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select(
        `
        *,
        intakes (course_title, month, year)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase fetch application by ID error:", error.message);
      return {
        success: false,
        data: null,
        message: "Failed to fetch application",
      };
    }

    if (!data) {
      return {
        success: false,
        data: null,
        message: "Application not found",
      };
    }

    const application: Application = {
      id: data.id,
      selected_intake_id: data.selected_intake_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      nationality: data.nationality,
      id_number: data.id_number,
      high_school_attended: data.high_school_attended,
      year_of_final_exam: data.year_of_final_exam,
      qualifying_grade: data.qualifying_grade,
      additional_qualifications: data.additional_qualifications,
      has_disability: data.has_disability,
      disability_type: data.disability_type,
      disability_details: data.disability_details,
      application_status: data.application_status,
      submitted_at: data.created_at,
      reviewed_at: data.reviewed_at,
      reviewed_by: data.reviewed_by,
      notes: data.notes,
      intake_title: data.intakes?.course_title || "N/A",
      intake_month: data.intakes?.month || "N/A",
      intake_year: data.intakes?.year || null,
    };

    return {
      success: true,
      data: application,
      message: "Application fetched successfully",
    };
  } catch (error) {
    console.error(
      "An unexpected error occurred during getApplicationById:",
      error,
    );
    return {
      success: false,
      data: null,
      message: "An unexpected server error occurred. Please try again.",
    };
  }
}

export async function bulkUpdateApplications(formData: FormData) {
  try {
    const applicationIds = formData.getAll("applicationIds") as string[];
    const action = formData.get("action") as string;
    const notes = formData.get("notes") as string;

    if (!applicationIds.length) {
      return {
        success: false,
        message: "No applications selected",
      };
    }

    const statusMap: {
      [key: string]: "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
    } = {
      approve: "APPROVED",
      reject: "REJECTED",
      review: "UNDER_REVIEW",
    };

    const newStatus = statusMap[action];

    if (!newStatus) {
      return {
        success: false,
        message: "Invalid action provided for bulk update.",
      };
    }

    const { error } = await supabase
      .from("applications")
      .update({
        application_status: newStatus,
        notes: notes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: "Admin User",
      })
      .in("id", applicationIds);

    if (error) {
      console.error("Supabase bulk update applications error:", error.message);
      return {
        success: false,
        message: "Failed to update applications",
      };
    }

    return {
      success: true,
      message: `${applicationIds.length} applications ${action}d successfully`,
    };
  } catch (error) {
    console.error(
      "An unexpected error occurred during bulkUpdateApplications:",
      error,
    );
    return {
      success: false,
      message: "An unexpected server error occurred. Please try again.",
    };
  }
}

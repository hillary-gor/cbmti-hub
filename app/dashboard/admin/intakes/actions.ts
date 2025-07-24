"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}
if (!supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface IntakeFormData {
  id?: string;
  year: string;
  month: string;
  label: string;
  status: "active" | "closed";
  opens_on: string;
  closes_on: string;
  course_id?: string | null;
  course_title: string;
  start_date: string;
  end_date: string;
  total_spots: number;
  enrolled_students: number;
  location: string;
  schedule: string;
  price_string: string;
  level: "Certificate" | "Diploma";
  icon_name?: string | null;
  requirements?: string | null;
  color_gradient_from?: string | null;
  color_gradient_to?: string | null;
  description?: string | null;
}

export async function createIntake(formData: IntakeFormData) {
  try {
    const dataToInsert: Partial<IntakeFormData> = { ...formData };
    if (dataToInsert.id !== undefined) {
      delete dataToInsert.id;
    }
    if (dataToInsert.label !== undefined) {
      delete dataToInsert.label;
    }

    const { error } = await supabase
      .from("intakes")
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error("Supabase create error:", error);
      return {
        success: false,
        message: error.message || "Failed to create intake.",
      };
    }

    revalidatePath("/intakes");
    return { success: true, message: "Intake created successfully!" };
  } catch (err) {
    console.error("Unexpected error in createIntake:", err);
    return {
      success: false,
      message: "An unexpected error occurred while creating intake.",
    };
  }
}

export async function updateIntake(id: string, formData: IntakeFormData) {
  try {
    const dataToUpdate: Partial<IntakeFormData> = { ...formData };
    if (dataToUpdate.id !== undefined) {
      delete dataToUpdate.id;
    }
    if (dataToUpdate.label !== undefined) {
      delete dataToUpdate.label;
    }

    const { data, error } = await supabase
      .from("intakes")
      .update(dataToUpdate)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return {
        success: false,
        message: error.message || "Failed to update intake.",
      };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Intake not found or no changes applied.",
      };
    }

    revalidatePath("/intakes");
    revalidatePath(`/intakes/${id}/edit`);
    return { success: true, message: "Intake updated successfully!" };
  } catch (err) {
    console.error("Unexpected error in updateIntake:", err);
    return {
      success: false,
      message: "An unexpected error occurred while updating intake.",
    };
  }
}

export async function deleteIntake(id: string) {
  try {
    const { error } = await supabase.from("intakes").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete intake.",
      };
    }

    revalidatePath("/intakes");
    return { success: true, message: "Intake deleted successfully!" };
  } catch (err) {
    console.error("Unexpected error in deleteIntake:", err);
    return {
      success: false,
      message: "An unexpected error occurred while deleting intake.",
    };
  }
}

export async function toggleIntakeStatus(id: string) {
  try {
    const { data: currentIntake, error: fetchError } = await supabase
      .from("intakes")
      .select("status")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Supabase fetch error for toggle status:", fetchError);
      return {
        success: false,
        message:
          fetchError.message || "Failed to find intake to toggle status.",
      };
    }
    if (!currentIntake) {
      return { success: false, message: "Intake not found." };
    }

    const newStatus = currentIntake.status === "active" ? "closed" : "active";

    const { error: updateError } = await supabase
      .from("intakes")
      .update({ status: newStatus })
      .eq("id", id)
      .select();

    if (updateError) {
      console.error("Supabase update status error:", updateError);
      return {
        success: false,
        message: updateError.message || "Failed to update intake status.",
      };
    }

    revalidatePath("/intakes");
    return {
      success: true,
      message: `Intake ${
        newStatus === "active" ? "activated" : "closed"
      } successfully!`,
    };
  } catch (err) {
    console.error("Unexpected error in toggleIntakeStatus:", err);
    return {
      success: false,
      message: "An unexpected error occurred while toggling intake status.",
    };
  }
}

export async function getIntakes(): Promise<IntakeFormData[]> {
  try {
    const { data, error } = await supabase
      .from("intakes")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (error) {
      console.error("Supabase getIntakes error:", error);
      return [];
    }

    return (data as IntakeFormData[]) || [];
  } catch (err) {
    console.error("Unexpected error in getIntakes:", err);
    return [];
  }
}

export async function getIntakeById(
  id: string
): Promise<IntakeFormData | null> {
  try {
    const { data, error } = await supabase
      .from("intakes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase getIntakeById error:", error);
      return null;
    }

    return (data as IntakeFormData) || null;
  } catch (err) {
    console.error("Unexpected error in getIntakeById:", err);
    return null;
  }
}

export async function duplicateIntake(id: string) {
  try {
    const { data: originalIntake, error: fetchError } = await supabase
      .from("intakes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Supabase fetch error for duplication:", fetchError);
      return {
        success: false,
        message: fetchError.message || "Intake not found for duplication.",
      };
    }
    if (!originalIntake) {
      return { success: false, message: "Intake not found." };
    }

    const duplicatedIntakeData = {
      ...originalIntake,
      id: undefined,
      label: undefined,
      enrolled_students: 0,
      status: "active",
    };

    const { error: insertError } = await supabase
      .from("intakes")
      .insert([duplicatedIntakeData])
      .select();

    if (insertError) {
      console.error("Supabase duplicate insert error:", insertError);
      return {
        success: false,
        message: insertError.message || "Failed to duplicate intake.",
      };
    }

    revalidatePath("/intakes");
    return { success: true, message: "Intake duplicated successfully!" };
  } catch (err) {
    console.error("Unexpected error in duplicateIntake:", err);
    return {
      success: false,
      message: "An unexpected error occurred while duplicating intake.",
    };
  }
}

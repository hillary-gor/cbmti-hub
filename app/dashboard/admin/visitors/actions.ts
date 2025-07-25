"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { Visitor } from "@/types/visitor";

export type ActionResponse = {
  status: "success" | "error" | "idle";
  message: string;
};

export async function checkInVisitor(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Unauthorized: Admin login required." };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string | null;
  const purpose = formData.get("purpose") as string | null;
  const description = formData.get("description") as string | null;
  const personToVisit = formData.get("person_to_visit") as string | null;

  if (!name || !phone) {
    return { status: "error", message: "Name and Phone Number are required." };
  }

  const { error } = await supabase.from("visitors").insert({
    name,
    phone,
    email: email || null,
    purpose: purpose || null,
    description: description || null,
    person_to_visit: personToVisit || null,
  });

  if (error) {
    console.error("Error checking in visitor:", error);
    return {
      status: "error",
      message: `Failed to check in visitor: ${error.message}`,
    };
  }

  revalidatePath("/dashboard/admin/visitors/records");
  revalidatePath("/dashboard/admin/visitors/checkin");

  return {
    status: "success",
    message: `Visitor ${name} checked in successfully!`,
  };
}

export async function getVisitors(
  filterStatus: "checked_in" | "checked_out" | "all" = "checked_in",
  startDate?: string,
  endDate?: string,
): Promise<{ visitors: Visitor[] | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { visitors: null, error: "Unauthorized: Admin login required." };
  }

  let query = supabase.from("visitors").select("*");

  if (filterStatus === "checked_in") {
    query = query.is("check_out_time", null);
  } else if (filterStatus === "checked_out") {
    query = query.not("check_out_time", "is", null);
  }

  if (startDate) {
    query = query.gte("check_in_time", startDate);
  }
  if (endDate) {
    const parsedEndDate = new Date(endDate);
    if (!isNaN(parsedEndDate.getTime())) {
      parsedEndDate.setDate(parsedEndDate.getDate() + 1);
      query = query.lt(
        "check_in_time",
        parsedEndDate.toISOString().split("T")[0],
      );
    } else {
      console.warn(`Invalid endDate provided to getVisitors: ${endDate}`);
    }
  }

  query = query.order("check_in_time", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching visitors:", error);
    return {
      visitors: null,
      error: `Failed to fetch visitors: ${error.message}`,
    };
  }

  return { visitors: data as Visitor[], error: null };
}

export async function checkOutVisitor(
  visitorId: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Unauthorized: Admin login required." };
  }

  const { error } = await supabase
    .from("visitors")
    .update({ check_out_time: new Date().toISOString() })
    .eq("id", visitorId);

  if (error) {
    console.error("Error checking out visitor:", error);
    return {
      status: "error",
      message: `Failed to check out visitor: ${error.message}`,
    };
  }

  revalidatePath("/dashboard/admin/visitors/records");
  revalidatePath("/dashboard/admin/visitors/checkin");

  return { status: "success", message: "Visitor checked out successfully!" };
}

export async function deleteVisitor(
  visitorId: string,
): Promise<ActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Unauthorized: Admin login required." };
  }

  const { error } = await supabase
    .from("visitors")
    .delete()
    .eq("id", visitorId);

  if (error) {
    console.error("Error deleting visitor:", error);
    return {
      status: "error",
      message: `Failed to delete visitor: ${error.message}`,
    };
  }

  revalidatePath("/dashboard/admin/visitors/records");
  revalidatePath("/dashboard/admin/visitors/checkin");

  return { status: "success", message: "Visitor record deleted successfully!" };
}

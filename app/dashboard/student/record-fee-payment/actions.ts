"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  FeePayment,
  ParsedPaymentData,
  PaymentFormState,
  PaymentSource,
  PaymentStatus,
} from "@/types/fee_payment";

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

async function getStudentIdFromUserId(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (studentError) {
    console.error(
      "[Action] Error fetching student ID for user:",
      studentError.message
    );
    return null;
  }
  return studentData?.id || null;
}

function parsePaymentMessage(message: string): ParsedPaymentData {
  const data: ParsedPaymentData = {
    amount: null,
    reference: null,
    parsed_date: null,
    parsed_time: null,
    institution: null,
    account_number: null,
    source: null as PaymentSource | null,
    isValid: false,
    errors: [],
  };

  message = message.trim();

  // M-Pesa regex for "sent to" messages
  const mpesaSentRegex =
    /(?:M-Pesa Ref:\s*|)([A-Z0-9]+)\s+Confirmed\.\s+Ksh([0-9,]+\.?\d{0,2})\s+sent\s+to\s+([A-Z0-9\s.,]+?)(?:\s+for\s+account\s+([A-Z0-9]+)|)\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i;

  // NCBA regex for "Your M-Pesa payment... was successful"
  const ncbaMpesaPaymentRegex =
    /Your M-Pesa payment of (?:KES|Ksh)\s*([0-9,]+\.?\d{0,2})\s+to\s+([A-Z0-9\s.,]+?)(?:\s+(\d+)|)\s+was successful on (\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\.\s+M-Pesa Ref:\s*([A-Z0-9]+)\.\s*(NCBA|KCB|Equity|Co-op Bank)/i;

  let match;

  // NCBA message format first as it's quite distinct
  match = message.match(ncbaMpesaPaymentRegex);
  if (match) {
    data.source = "ncba";
    data.amount = parseFloat(match[1].replace(/,/g, ""));
    data.institution = match[2].trim();
    data.account_number = match[3] || null;
    data.reference = match[6];

    // Date parsing (DD/MM/YYYY)
    const [day, month, year] = match[4].split("/");
    data.parsed_date = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    // Time parsing (HH:MM AM/PM)
    const timeStr = match[5].toUpperCase().replace(/\s/g, "");
    if (timeStr.endsWith("AM") || timeStr.endsWith("PM")) {
      const [hourMin, ampm] = [timeStr.slice(0, -2), timeStr.slice(-2)];
      const [h, m] = hourMin.split(":");
      let hours = parseInt(h);
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      data.parsed_time = `${String(hours).padStart(2, "0")}:${m}:00`;
    } else {
      data.parsed_time = `${match[5]}:00`.substring(0, 8);
    }
  } else {
    // M-Pesa "sent to" message format
    match = message.match(mpesaSentRegex);
    if (match) {
      data.source = "mpesa";
      data.reference = match[1];
      data.amount = parseFloat(match[2].replace(/,/g, ""));
      data.institution = match[3].trim();
      data.account_number = match[4] || null;

      // Date parsing (D/M/YY or DD/MM/YYYY)
      const [day, month, year] = match[5].split("/");
      const fullYear = year.length === 2 ? `20${year}` : year;
      data.parsed_date = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;

      // Time parsing (H:MM AM/PM or HH:MM AM/PM)
      const timeStr = match[6].toUpperCase().replace(/\s/g, "");
      if (timeStr.endsWith("AM") || timeStr.endsWith("PM")) {
        const [hourMin, ampm] = [timeStr.slice(0, -2), timeStr.slice(-2)];
        const [h, m] = hourMin.split(":");
        let hours = parseInt(h);
        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;
        data.parsed_time = `${String(hours).padStart(2, "0")}:${m}:00`;
      } else {
        data.parsed_time = `${match[6]}:00`.substring(0, 8);
      }
    }
  }

  if (data.amount === null || isNaN(data.amount) || data.amount <= 0) {
    data.errors.push("Could not parse valid amount.");
  }
  if (!data.reference) {
    data.errors.push("Could not parse reference code.");
  }
  if (!data.parsed_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.parsed_date)) {
    data.errors.push("Could not parse valid date (YYYY-MM-DD).");
  }
  if (!data.parsed_time || !/^\d{2}:\d{2}:\d{2}$/.test(data.parsed_time)) {
    data.errors.push("Could not parse valid time (HH:MM:SS).");
  }
  if (!data.source) {
    data.errors.push("Could not determine source (M-Pesa/NCBA).");
  }

  data.isValid = data.errors.length === 0;

  return data;
}

export async function recordFeePayment(
  prevState: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  const messageText = formData.get("messageText") as string;
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    redirect("/login");
  }

  const studentId = await getStudentIdFromUserId(userId);
  if (!studentId) {
    console.error(`No student profile found for user ID: ${userId}`);
    return {
      status: "error",
      message: "Student profile not found. Please contact support.",
      parsedData: null,
    };
  }

  if (!messageText) {
    return {
      status: "error",
      message: "Payment SMS message cannot be empty.",
      parsedData: null,
    };
  }

  const parsedData = parsePaymentMessage(messageText);

  if (!parsedData.isValid) {
    return {
      status: "error",
      message: `Parsing failed: ${parsedData.errors.join(", ")}`,
      parsedData: parsedData,
    };
  }

  const supabase = await createClient();

  try {
    const { data: existingPayments, error: duplicateCheckError } =
      await supabase
        .from("fee_payments")
        .select("id")
        .eq("reference", parsedData.reference)
        .eq("parsed_date", parsedData.parsed_date)
        .eq("parsed_time", parsedData.parsed_time)
        .eq("amount", parsedData.amount)
        .eq("student_id", studentId);

    if (duplicateCheckError) {
      console.error("Duplicate check error:", duplicateCheckError);
      return {
        status: "error",
        message: "Error checking for duplicates. Please try again.",
        parsedData: null,
      };
    }

    if (existingPayments && existingPayments.length > 0) {
      return {
        status: "error",
        message:
          "Duplicate payment detected. This payment has already been recorded.",
        parsedData: parsedData,
      };
    }

    const { error: insertError } = await supabase.from("fee_payments").insert({
      student_id: studentId,
      amount: parsedData.amount,
      reference: parsedData.reference,
      institution: parsedData.institution,
      account_number: parsedData.account_number,
      message_text: messageText,
      parsed_date: parsedData.parsed_date,
      parsed_time: parsedData.parsed_time,
      status: "pending",
      source: parsedData.source,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return {
        status: "error",
        message: `Failed to record payment: ${insertError.message}`,
        parsedData: null,
      };
    }

    revalidatePath("/dashboard/students/record-fee-payment");
    return {
      status: "success",
      message: "Payment recorded successfully with pending status!",
      parsedData: parsedData,
    };
  } catch (error) {
    console.error("Unhandled error in recordFeePayment:", error);
    return {
      status: "error",
      message: "An unexpected error occurred.",
      parsedData: null,
    };
  }
}

export async function getFeePayments(
  filterStatus?: PaymentStatus
): Promise<FeePayment[]> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    console.warn("Attempted to fetch payments without an authenticated user.");
    redirect("/login");
  }

  const studentId = await getStudentIdFromUserId(userId);
  if (!studentId) {
    console.error(
      `No student profile found for user ID: ${userId} when fetching payments.`
    );
    return [];
  }

  let query = supabase
    .from("fee_payments")
    .select("*")
    .eq("student_id", studentId)
    .order("recorded_at", { ascending: false });

  if (
    filterStatus &&
    ["pending", "approved", "declined"].includes(filterStatus)
  ) {
    query = query.eq("status", filterStatus);
  }

  const { data: payments, error } = await query;

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return payments || [];
}

export async function updatePaymentStatus(
  paymentId: string,
  newStatus: PaymentStatus
) {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { status: "error", message: "Authentication required." };
  }

  const studentId = await getStudentIdFromUserId(userId);
  if (!studentId) {
    console.error(
      `No student profile found for user ID: ${userId} when updating payment status.`
    );
    return { status: "error", message: "Student profile not found." };
  }

  const { error } = await supabase
    .from("fee_payments")
    .update({ status: newStatus })
    .eq("id", paymentId)
    .eq("student_id", studentId);

  if (error) {
    console.error("Error updating payment status:", error);
    return {
      status: "error",
      message: `Failed to update status: ${error.message}`,
    };
  }

  revalidatePath("/dashboard/students/record-fee-payment");
  return { status: "success", message: "Payment status updated." };
}

/**
 * Fetch the sum of approved payments for the currently authenticated student.
 */
export async function getApprovedPaymentsSumForStudent(): Promise<number> {
  const supabase = await createClient();
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    console.warn(
      "[Server Action] Attempted to get approved payments sum without an authenticated user."
    );
    return 0;
  }

  const studentId = await getStudentIdFromUserId(userId);

  if (!studentId) {
    console.warn(
      `[Server Action] No student profile found for user ID: ${userId} when calculating approved sum.`
    );
    return 0;
  }

  const { data, error } = await supabase
    .from("fee_payments")
    .select("amount")
    .eq("student_id", studentId)
    .eq("status", "approved");

  if (error) {
    console.error(
      `[Server Action] Error fetching approved payments sum for student ${studentId}:`,
      error
    );
    return 0;
  }

  const sum = (data ?? []).reduce((acc, payment) => acc + payment.amount, 0);
  return sum;
}

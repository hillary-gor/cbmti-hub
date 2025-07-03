"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import {
  FeePayment,
  ParsedPaymentData,
  PaymentFormState,
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

// Helper to format time to HH:MM:SS
function formatTimeForDB(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const date = new Date(`2000-01-01 ${timeStr}`);
  if (isNaN(date.getTime())) {
    return null;
  }
  return format(date, "HH:mm:ss");
}

function parsePaymentMessage(message: string): ParsedPaymentData {
  const data: ParsedPaymentData = {
    amount: null,
    reference: null,
    parsed_date: null,
    parsed_time: null,
    institution: null,
    account_number: null,
    source: null,
    isValid: false,
    errors: [],
  };

  message = message.trim();

  const mpesaRegex =
    /(?:M-Pesa Ref:\s*|)([A-Z0-9]+)\s+Confirmed\.\s+(?:You have received|Ksh)\s*([0-9,]+\.?\d{0,2})\s+(?:from|sent to)\s+([A-Z0-9\s.,-]+?)(?:\s+for account\s+([A-Z0-9]+)|)\s+on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?)/i;

  const ncbaMpesaPaymentRegex =
    /Your M-Pesa payment of (?:KES|Ksh)\s*([0-9,]+\.?\d{0,2})\s+to\s+([A-Z0-9\s.,-]+?)(?:\s+(\d+)|)\s+was successful on (\d{1,2}\/\d{1,2}\/\d{2,4})\s+(\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?)\.\s+M-Pesa Ref:\s*([A-Z0-9]+)\./i;

  let match;

  // Try NCBA format first
  match = message.match(ncbaMpesaPaymentRegex);
  if (match) {
    data.source = "sms";
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

    // Time parsing (HH:MM AM/PM) and formatting to HH:MM:SS
    data.parsed_time = formatTimeForDB(match[5]);
  } else {
    // Try M-Pesa format
    match = message.match(mpesaRegex);
    if (match) {
      data.source = "sms";
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

      // Time parsing (H:MM AM/PM or HH:MM AM/PM) and formatting to HH:MM:SS
      data.parsed_time = formatTimeForDB(match[6]);
    }
  }

  // Validation
  if (data.amount === null || isNaN(data.amount) || data.amount <= 0) {
    data.errors.push("Could not parse valid amount.");
  }
  if (!data.reference) {
    data.errors.push("Could not parse reference code.");
  }
  if (!data.parsed_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.parsed_date)) {
    data.errors.push("Could not parse valid date (YYYY-MM-DD).");
  }
  if (
    data.source === "sms" &&
    (!data.parsed_time || !/^\d{2}:\d{2}:\d{2}$/.test(data.parsed_time))
  ) {
    // parsed_time is optional for bank deposits
    data.errors.push("Could not parse valid time (HH:MM:SS).");
  }
  if (!data.source) {
    data.errors.push("Could not determine source (M-Pesa/NCBA/Bank).");
  }

  data.isValid = data.errors.length === 0;

  return data;
}

export async function recordFeePayment(
  prevState: PaymentFormState,
  formData: FormData
): Promise<PaymentFormState> {
  const paymentMethod = formData.get("paymentMethod") as
    | "sms"
    | "bank_cash"
    | "bank_cheque";

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

  const supabase = await createClient();

  try {
    let finalRecord: Omit<FeePayment, "id" | "recorded_at">;
    let parsedDataForPreview: ParsedPaymentData | null = null;
    let successMessage: string;

    if (paymentMethod === "sms") {
      const messageText = formData.get("messageText") as string;
      if (!messageText) {
        return {
          status: "error",
          message: "Payment SMS message cannot be empty.",
          parsedData: null,
        };
      }

      parsedDataForPreview = parsePaymentMessage(messageText);

      if (!parsedDataForPreview.isValid) {
        return {
          status: "error",
          message: `Parsing failed: ${parsedDataForPreview.errors.join(", ")}`,
          parsedData: parsedDataForPreview,
        };
      }

      // Check for duplicate SMS payments
      const { data: existingPayments, error: duplicateCheckError } =
        await supabase
          .from("fee_payments")
          .select("id")
          .eq("reference", parsedDataForPreview.reference)
          .eq("parsed_date", parsedDataForPreview.parsed_date)
          .eq("parsed_time", parsedDataForPreview.parsed_time)
          .eq("amount", parsedDataForPreview.amount)
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
          parsedData: parsedDataForPreview,
        };
      }

      finalRecord = {
        student_id: studentId,
        amount: parsedDataForPreview.amount!,
        reference: parsedDataForPreview.reference!,
        institution: parsedDataForPreview.institution,
        account_number: parsedDataForPreview.account_number,
        message_text: messageText,
        parsed_date: parsedDataForPreview.parsed_date!,
        parsed_time: parsedDataForPreview.parsed_time,
        status: "pending",
        source: "sms",
      };
      successMessage = "SMS payment recorded successfully with pending status!";
    } else if (
      paymentMethod === "bank_cash" ||
      paymentMethod === "bank_cheque"
    ) {
      const bankAmountStr = formData.get("bankAmount") as string;
      const bankDateStr = formData.get("bankDate") as string;
      const bankName = formData.get("bankName") as string;
      const depositorName = (formData.get("depositorName") as string) || null;

      const bankAmount = parseFloat(bankAmountStr);

      if (isNaN(bankAmount) || bankAmount <= 0) {
        return {
          status: "error",
          message: "Valid amount is required for bank deposits.",
          parsedData: null,
        };
      }
      if (!bankDateStr) {
        return {
          status: "error",
          message: "Deposit date is required for bank deposits.",
          parsedData: null,
        };
      }
      if (!bankName || bankName.trim() === "") {
        return {
          status: "error",
          message: "Bank name is required for bank deposits.",
          parsedData: null,
        };
      }

      let reference: string | null = null;
      let descriptiveMessage: string;
      const parsedTime = null;

      if (paymentMethod === "bank_cash") {
        reference = (formData.get("bankReference") as string)?.trim();
        if (!reference) {
          return {
            status: "error",
            message: "Cash deposit slip reference number is required.",
            parsedData: null,
          };
        }
        descriptiveMessage = `Bank Deposit (Cash) Ref: ${reference}`;
      } else {
        // bank_cheque
        const chequeNumber = (formData.get("chequeNumber") as string)?.trim();
        if (!chequeNumber) {
          return {
            status: "error",
            message: "Cheque number is required for cheque deposits.",
            parsedData: null,
          };
        }
        reference = `CHEQUE_${chequeNumber}`;
        descriptiveMessage = `Bank Deposit (Cheque) No: ${chequeNumber}`;
      }

      if (depositorName) {
        descriptiveMessage += ` by ${depositorName}`;
      }
      descriptiveMessage += `. Bank: ${bankName}, Date: ${bankDateStr}.`;

      // Check for duplicate bank payments (basic check)
      const { data: existingPayments, error: duplicateCheckError } =
        await supabase
          .from("fee_payments")
          .select("id")
          .eq("reference", reference)
          .eq("parsed_date", bankDateStr)
          .eq("amount", bankAmount)
          .eq("source", paymentMethod)
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
            "Duplicate payment detected. This bank payment has already been recorded.",
          parsedData: null,
        };
      }

      finalRecord = {
        student_id: studentId,
        amount: bankAmount,
        reference: reference,
        institution: bankName,
        account_number: null,
        message_text: descriptiveMessage,
        parsed_date: bankDateStr,
        parsed_time: parsedTime,
        status: "pending",
        source: paymentMethod,
      };
      successMessage = `${
        paymentMethod === "bank_cash" ? "Cash" : "Cheque"
      } deposit recorded successfully with pending status!`;
    } else {
      return {
        status: "error",
        message: "Invalid payment method selected.",
        parsedData: null,
      };
    }

    const { error: insertError } = await supabase
      .from("fee_payments")
      .insert(finalRecord);

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
      message: successMessage,
      parsedData: parsedDataForPreview,
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

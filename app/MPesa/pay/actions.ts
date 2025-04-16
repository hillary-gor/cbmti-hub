"use server"

import { paymentSchema } from "./schema"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { getAccessToken, sendSTKPush } from "@/lib/mpesa"

type PaymentState = {
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
}

export async function initiatePayment(
  _prevState: PaymentState,
  formData: FormData
): Promise<PaymentState> {
  const parsed = paymentSchema.safeParse({
    phone: formData.get("phone"),
    amount: formData.get("amount"),
  })

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const { phone, amount } = parsed.data

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  // Get student_id via relationship
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("id", user.id)
    .single()

  if (!student) {
    return { success: false, error: "Student record not found" }
  }

  const token = await getAccessToken()
  const stkResponse = await sendSTKPush({
    phone,
    amount,
    token,
    shortcode: process.env.MPESA_SHORTCODE!,
    passkey: process.env.MPESA_PASSKEY!,
    callbackURL: process.env.MPESA_CALLBACK_URL!,
  })

  if (!stkResponse.CheckoutRequestID) {
    return {
      success: false,
      error: stkResponse?.errorMessage || "Failed to send STK push",
    }
  }

  // Save to DB
  const { error: insertError } = await supabase.from("payments").insert({
    student_id: student.id,
    phone,
    amount,
    status: "pending",
    channel: "mpesa",
    checkout_request_id: stkResponse.CheckoutRequestID,
    created_by: user.id,
  })

  if (insertError) {
    return {
      success: false,
      error: "Failed to save payment record",
    }
  }

  revalidatePath("/mpesa/balance")

  return { success: true }
}

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type CallbackItem = {
  Name: string;
  Value?: string | number;
};

type MpesaCallbackPayload = {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      CallbackMetadata?: {
        Item: CallbackItem[];
      };
    };
  };
};

export async function POST(req: Request) {
  const payload = (await req.json()) as MpesaCallbackPayload;

  const {
    Body: {
      stkCallback: { ResultCode, CheckoutRequestID, CallbackMetadata },
    },
  } = payload;

  const supabase = await createClient();

  if (ResultCode === 0 && CallbackMetadata) {
    const receipt = CallbackMetadata.Item.find(
      (item) => item.Name === "MpesaReceiptNumber",
    )?.Value as string;
    const amount = CallbackMetadata.Item.find((item) => item.Name === "Amount")
      ?.Value as number;

    // Update the payment record
    const { data: payment } = await supabase
      .from("payments")
      .update({
        status: "confirmed",
        mpesa_receipt: receipt,
        mpesa_data: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("checkout_request_id", CheckoutRequestID)
      .select("student_id")
      .single();

    // Update the student's balance
    if (payment?.student_id && amount) {
      await supabase.rpc("add_to_balance", {
        sid: payment.student_id,
        amt: amount,
      });
    }
  } else {
    // Update failed payment
    await supabase
      .from("payments")
      .update({
        status: "failed",
        mpesa_data: payload,
        updated_at: new Date().toISOString(),
      })
      .eq("checkout_request_id", CheckoutRequestID);
  }

  return NextResponse.json({ success: true });
}

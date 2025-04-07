import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface CallbackItem {
  Name: string;
  Value: string | number;
}

interface StkCallback {
  ResultCode: number;
  CallbackMetadata?: {
    Item: CallbackItem[];
  };
}

interface MpesaCallbackBody {
  Body: {
    stkCallback: StkCallback;
  };
}

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body: MpesaCallbackBody = await req.json();
  const { stkCallback } = body.Body;

  if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
    const findItem = (name: string) =>
      stkCallback.CallbackMetadata!.Item.find(item => item.Name === name)?.Value;

    const paymentDetails = {
      amount: findItem("Amount") as number,
      mpesa_receipt: findItem("MpesaReceiptNumber") as string,
      phone_number: findItem("PhoneNumber") as string,
      transaction_date: new Date(),
      status: "completed",
    };

    await supabase
      .from("payments")
      .update({ 
        status: "completed", 
        mpesa_receipt: paymentDetails.mpesa_receipt 
      })
      .eq("phone_number", paymentDetails.phone_number)
      .eq("status", "pending");

    return NextResponse.json({ success: true, message: "Payment received." });
  } else {
    return NextResponse.json({ success: false, message: "Payment failed." });
  }
}

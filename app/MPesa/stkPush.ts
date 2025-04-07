"use server";

import { createClient } from "@supabase/supabase-js";

export async function stkPush(phone: string, amount: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);

  const password = Buffer.from(
    `${process.env.PAYBILL_NUMBER}${process.env.PAYBILL_PASSKEY}${timestamp}`
  ).toString("base64");

  const response = await fetch(
    "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: process.env.PAYBILL_NUMBER,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.PAYBILL_NUMBER,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: "School Fees",
        TransactionDesc: "School Fees Payment",
      }),
    }
  );

  const data = await response.json();

  if (data.ResponseCode === "0") {
    await supabase.from("payments").insert([
      { phone_number: phone, amount: amount, status: "pending" },
    ]);
    return { success: true, message: "STK Push sent, check your phone." };
  } else {
    return { success: false, message: data.errorMessage };
  }
}

async function getAccessToken() {
  const credentials = Buffer.from(
    `${process.env.DARAJA_CONSUMER_KEY}:${process.env.DARAJA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(
    "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  const data = await response.json();
  return data.access_token;
}

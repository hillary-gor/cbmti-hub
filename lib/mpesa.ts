// lib/mpesa.ts
import { Buffer } from "buffer";

const BASE_URL =
  process.env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

export async function getAccessToken(): Promise<string> {
  const credentials = `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`;
  const encoded = Buffer.from(credentials).toString("base64");

  const res = await fetch(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${encoded}` },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch M-Pesa token");
  }

  const data = await res.json();
  return data.access_token;
}

export type STKPushResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
  errorCode?: string;
  errorMessage?: string;
};

type STKPayload = {
  phone: string;
  amount: number;
  token: string;
  shortcode: string;
  passkey: string;
  callbackURL: string;
};

export async function sendSTKPush({
  phone,
  amount,
  token,
  shortcode,
  passkey,
  callbackURL,
}: STKPayload): Promise<STKPushResponse> {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const password = Buffer.from(shortcode + passkey + timestamp).toString(
    "base64",
  );

  const body = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: callbackURL,
    AccountReference: "SchoolFees",
    TransactionDesc: "Fee payment",
  };

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.errorMessage || "STK Push failed");
  }

  const data: STKPushResponse = await res.json();
  return data;
}

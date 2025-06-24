"use client";

import React, { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { recordFeePayment } from "../actions";
import { ParsedPaymentData, PaymentFormState } from "@/types/fee_payment";

interface PaymentFormProps {
  initialParsedData?: ParsedPaymentData | null;
}
const initialState: PaymentFormState = {
  status: "",
  message: "",
  parsedData: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "Recording..." : "Record Payment"}
    </button>
  );
}

export default function PaymentForm({
  initialParsedData = null,
}: PaymentFormProps) {
  const [state, formAction] = useActionState(recordFeePayment, initialState);
  const [messageText, setMessageText] = useState("");
  const [parsedPreview, setParsedPreview] = useState<ParsedPaymentData | null>(
    initialParsedData
  );

  useEffect(() => {
    if (state.parsedData) {
      setParsedPreview(state.parsedData);
    } else {
      setParsedPreview(null);
    }
  }, [state]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    setParsedPreview(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Record New Payment
      </h2>
      <form action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="messageText"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Paste Payment SMS Message (M-Pesa or NCBA)
          </label>
          <textarea
            id="messageText"
            name="messageText"
            rows={6}
            value={messageText}
            onChange={handleMessageChange}
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="E.g., NGN... Confirmed. You have received Ksh..."
            required
          ></textarea>
        </div>

        {parsedPreview && parsedPreview.isValid && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold mb-3">
              Parsed Payment Details (Preview)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <strong>Amount:</strong> Ksh{" "}
                {parsedPreview.amount?.toFixed(2) || "N/A"}
              </p>
              <p>
                <strong>Reference:</strong> {parsedPreview.reference || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {parsedPreview.parsed_date || "N/A"}
              </p>
              <p>
                <strong>Time:</strong> {parsedPreview.parsed_time || "N/A"}
              </p>
              <p>
                <strong>Institution:</strong>{" "}
                {parsedPreview.institution || "N/A"}
              </p>
              <p>
                <strong>Account No:</strong>{" "}
                {parsedPreview.account_number || "N/A"}
              </p>
              <p>
                <strong>Source:</strong> {parsedPreview.source || "N/A"}
              </p>
            </div>
          </div>
        )}

        {parsedPreview &&
          !parsedPreview.isValid &&
          parsedPreview.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold mb-3">Parsing Errors:</h3>
              <ul className="list-disc pl-5 text-sm">
                {parsedPreview.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

        <SubmitButton />

        {state.status && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-medium ${
              state.status === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
            role="alert"
          >
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { recordFeePayment } from "../actions"; // This line correctly imports recordFeePayment
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
  const [paymentMethod, setPaymentMethod] = useState<
    "mpesa" | "ncba" | "bank_cash" | "bank_cheque"
  >("mpesa"); // Changed initial state and type
  const [messageText, setMessageText] = useState("");
  const [bankAmount, setBankAmount] = useState<string>("");
  const [bankDate, setBankDate] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [depositorName, setDepositorName] = useState<string>("");

  // For individual reference number cells (Cash Deposit)
  const BANK_REFERENCE_LENGTH = 12;
  const [bankReferenceDigits, setBankReferenceDigits] = useState<string[]>(
    Array(BANK_REFERENCE_LENGTH).fill("")
  );
  const bankRefInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // For individual cheque number cells (Cheque Deposit)
  const CHEQUE_NUMBER_LENGTH = 12;
  const [chequeNumberDigits, setChequeNumberDigits] = useState<string[]>(
    Array(CHEQUE_NUMBER_LENGTH).fill("")
  );
  const chequeNumInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // For the preview section, we'll only show parsed data from SMS
  const [parsedPreview, setParsedPreview] = useState<ParsedPaymentData | null>(
    initialParsedData
  );

  useEffect(() => {
    // Only update parsedPreview if the action returned data and it's an SMS type
    if (state.parsedData && (state.parsedData.source === "mpesa" || state.parsedData.source === "ncba")) {
      setParsedPreview(state.parsedData);
      // Clear SMS message text if successfully parsed and recorded
      if (state.status === "success") {
        setMessageText("");
      }
    } else {
      // Clear preview for non-SMS methods or if parsing failed/no data
      setParsedPreview(null);
    }

    // Clear bank deposit fields if a bank payment was successfully recorded
    if (
      state.status === "success" &&
      (paymentMethod === "bank_cash" || paymentMethod === "bank_cheque")
    ) {
      setBankAmount("");
      setBankDate("");
      setBankName("");
      setDepositorName("");
      setBankReferenceDigits(Array(BANK_REFERENCE_LENGTH).fill(""));
      setChequeNumberDigits(Array(CHEQUE_NUMBER_LENGTH).fill(""));
    }
  }, [state, paymentMethod, BANK_REFERENCE_LENGTH, CHEQUE_NUMBER_LENGTH]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    setParsedPreview(null); // Clear preview when message text changes
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMethod = e.target.value as
      | "mpesa"
      | "ncba"
      | "bank_cash"
      | "bank_cheque"; // Changed type
    setPaymentMethod(newMethod);
    // Clear all method-specific input states and preview when changing method
    setMessageText("");
    setBankAmount("");
    setBankDate("");
    setBankName("");
    setDepositorName("");
    setBankReferenceDigits(Array(BANK_REFERENCE_LENGTH).fill(""));
    setChequeNumberDigits(Array(CHEQUE_NUMBER_LENGTH).fill(""));
    setParsedPreview(null);
  };

  // Generic handler for individual digit cell changes
  const handleDigitChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    digits: string[],
    setDigits: React.Dispatch<React.SetStateAction<string[]>>,
    inputRefsArray: React.MutableRefObject<Array<HTMLInputElement | null>>,
    length: number
  ) => {
    const value = e.target.value;
    if (value.length > 1) return;

    const newDigits = [...digits];
    newDigits[index] = value.toUpperCase();
    setDigits(newDigits);

    // Move focus to next input if a character was entered and it's not the last input
    if (value && index < length - 1) {
      inputRefsArray.current[index + 1]?.focus();
    }
  };

  // Handler for backspace and arrow keys in digit cells
  const handleDigitKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    digits: string[],
    inputRefsArray: React.MutableRefObject<Array<HTMLInputElement | null>>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefsArray.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefsArray.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < digits.length - 1) {
      inputRefsArray.current[index + 1]?.focus();
    }
  };

  // Combine the digits into a single string for form submission
  const bankReference = bankReferenceDigits.join("");
  const chequeNumber = chequeNumberDigits.join("");

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Record New Payment
      </h2>
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="paymentMethod" value={paymentMethod} />

        {paymentMethod === "bank_cash" && (
          <input type="hidden" name="bankReference" value={bankReference} />
        )}
        {paymentMethod === "bank_cheque" && (
          <input type="hidden" name="chequeNumber" value={chequeNumber} />
        )}

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Payment Method
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethodRadio"
                value="mpesa" // Changed value
                checked={paymentMethod === "mpesa"}
                onChange={handlePaymentMethodChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">M-Pesa SMS</span> {/* Changed label */}
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethodRadio"
                value="ncba" // New option
                checked={paymentMethod === "ncba"}
                onChange={handlePaymentMethodChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">NCBA M-Pesa SMS</span> {/* New label */}
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethodRadio"
                value="bank_cash"
                checked={paymentMethod === "bank_cash"}
                onChange={handlePaymentMethodChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Bank Deposit (Cash)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethodRadio"
                value="bank_cheque"
                checked={paymentMethod === "bank_cheque"}
                onChange={handlePaymentMethodChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Bank Deposit (Cheque)</span>
            </label>
          </div>
        </div>

        {/* Conditional Rendering based on paymentMethod */}
        {(paymentMethod === "mpesa" || paymentMethod === "ncba") && ( // Changed condition
          <div>
            <label
              htmlFor="messageText"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Paste Payment SMS Message ({paymentMethod === "mpesa" ? "M-Pesa" : "NCBA"})
            </label>
            <textarea
              id="messageText"
              name="messageText"
              rows={6}
              value={messageText}
              onChange={handleMessageChange}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder={`E.g., ${paymentMethod === "mpesa" ? "NGN... Confirmed. You have received Ksh..." : "Your M-Pesa payment of KES..."}`} // Dynamic placeholder
              required={paymentMethod === "mpesa" || paymentMethod === "ncba"} // Changed condition
            ></textarea>
          </div>
        )}

        {(paymentMethod === "bank_cash" || paymentMethod === "bank_cheque") && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bankAmount"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Amount (Ksh)
              </label>
              <input
                type="number"
                id="bankAmount"
                name="bankAmount"
                step="0.01"
                value={bankAmount}
                onChange={(e) => setBankAmount(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g., 15000.00"
                required
              />
            </div>
            <div>
              <label
                htmlFor="bankDate"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Deposit Date
              </label>
              <input
                type="date"
                id="bankDate"
                name="bankDate"
                value={bankDate}
                onChange={(e) => setBankDate(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label
                htmlFor="bankName"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g., NCBA Bank"
                required
              />
            </div>

            {paymentMethod === "bank_cash" && (
              <div>
                <label
                  htmlFor="bankReference"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Cash Deposit Slip Reference Number ({BANK_REFERENCE_LENGTH}{" "}
                  characters)
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                  {bankReferenceDigits.map((digit, index) => (
                    <input
                      key={`bank-ref-${index}`}
                      type="text"
                      inputMode="text"
                      pattern="[0-9A-Za-z]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleDigitChange(
                          e,
                          index,
                          bankReferenceDigits,
                          setBankReferenceDigits,
                          bankRefInputRefs,
                          BANK_REFERENCE_LENGTH
                        )
                      }
                      onKeyDown={(e) =>
                        handleDigitKeyDown(
                          e,
                          index,
                          bankReferenceDigits,
                          bankRefInputRefs
                        )
                      }
                      ref={(el) => {
                        bankRefInputRefs.current[index] = el;
                      }}
                      className="w-9 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required={paymentMethod === "bank_cash"}
                    />
                  ))}
                </div>
                {bankReference.length !== BANK_REFERENCE_LENGTH &&
                  paymentMethod === "bank_cash" && (
                    <p className="mt-2 text-red-600 text-sm text-center">
                      Please enter a {BANK_REFERENCE_LENGTH}-character reference
                      number.
                    </p>
                  )}
              </div>
            )}

            {paymentMethod === "bank_cheque" && (
              <div>
                <label
                  htmlFor="chequeNumber"
                  className="block text-gray-700 text-sm font-semibold mb-2"
                >
                  Cheque Number ({CHEQUE_NUMBER_LENGTH} digits)
                </label>
                <div className="flex flex-wrap justify-center gap-2">
                  {chequeNumberDigits.map((digit, index) => (
                    <input
                      key={`cheque-num-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleDigitChange(
                          e,
                          index,
                          chequeNumberDigits,
                          setChequeNumberDigits,
                          chequeNumInputRefs,
                          CHEQUE_NUMBER_LENGTH
                        )
                      }
                      onKeyDown={(e) =>
                        handleDigitKeyDown(
                          e,
                          index,
                          chequeNumberDigits,
                          chequeNumInputRefs
                        )
                      }
                      ref={(el) => {
                        chequeNumInputRefs.current[index] = el;
                      }}
                      className="w-9 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required={paymentMethod === "bank_cheque"}
                    />
                  ))}
                </div>
                {chequeNumber.length !== CHEQUE_NUMBER_LENGTH &&
                  paymentMethod === "bank_cheque" && (
                    <p className="mt-2 text-red-600 text-sm text-center">
                      Please enter a {CHEQUE_NUMBER_LENGTH}-digit cheque number.
                    </p>
                  )}
              </div>
            )}

            <div>
              <label
                htmlFor="depositorName"
                className="block text-gray-700 text-sm font-semibold mb-2"
              >
                Depositor&apos;s Name (Optional)
              </label>
              <input
                type="text"
                id="depositorName"
                name="depositorName"
                value={depositorName}
                onChange={(e) => setDepositorName(e.target.value)}
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Name of the person who made the deposit"
              />
            </div>
          </div>
        )}

        {/* Parsed Preview (only for SMS messages) */}
        {(paymentMethod === "mpesa" || paymentMethod === "ncba") && parsedPreview && parsedPreview.isValid && ( // Changed condition
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

        {/* Parsing Errors (only for SMS messages) */}
        {(paymentMethod === "mpesa" || paymentMethod === "ncba") && // Changed condition
          parsedPreview &&
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
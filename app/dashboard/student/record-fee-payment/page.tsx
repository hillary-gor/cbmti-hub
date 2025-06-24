import { Suspense } from "react";
import PaymentForm from "./components/PaymentForm";
import PaymentHistory from "./components/PaymentHistory";
import { getFeePayments, getApprovedPaymentsSumForStudent } from "./actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export default async function RecordFeePaymentPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error(
      "Authentication error or user not logged in:",
      authError?.message
    );
    redirect("/login");
  }

  const [payments, totalApprovedPayments] = await Promise.all([
    getFeePayments(),
    getApprovedPaymentsSumForStudent(),
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
          Student Fee Payment Gateway
        </h1>
        <p className="mt-2 text-lg text-gray-600 text-center">
          Record your fee payments by pasting the SMS confirmation.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Suspense
          fallback={
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-pulse">
                Loading Payment Form...
              </h2>
              <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          }
        >
          <PaymentForm />
        </Suspense>

        <Suspense
          fallback={
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-pulse">
                Loading Payment History...
              </h2>
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          }
        >
          <PaymentHistory
            payments={payments}
            totalApprovedPayments={totalApprovedPayments}
            isLoadingApprovedSum={false}
          />
        </Suspense>
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Student Payment. eHub. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

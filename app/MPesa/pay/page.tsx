import { PaymentForm } from "./components/PaymentForm";

export default function MPesaPayPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pay School Fees</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your phone number and amount below. You will receive an STK Push
          to complete your payment via M-Pesa.
        </p>
      </div>

      <PaymentForm />

      <div className="text-xs text-muted-foreground">
        <p className="mt-6">
          ⚠ Make sure you’re using a Safaricom line (2547XXXXXXXX) with M-Pesa
          enabled. Once paid, your balance will be updated in your account.
        </p>
      </div>
    </div>
  );
}

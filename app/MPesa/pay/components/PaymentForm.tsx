"use client"

import { useFormState } from "react-dom"
import { initiatePayment } from "../actions"

type FormState = {
  success?: boolean
  error?: string
  errors?: Record<string, string[]>
}

const initialState: FormState = {}

export function PaymentForm() {
  const [state, formAction] = useFormState(initiatePayment, initialState)

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Safaricom Number
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="2547XXXXXXXX"
          className="input w-full"
        />
        {state.errors?.phone && (
          <p className="text-sm text-red-500">{state.errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount (KES)
        </label>
        <input
          type="number"
          name="amount"
          id="amount"
          placeholder="e.g. 1000"
          className="input w-full"
        />
        {state.errors?.amount && (
          <p className="text-sm text-red-500">{state.errors.amount}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Pay Now
      </button>

      {state.success && (
        <p className="text-sm text-green-600 mt-2">
          STK Push sent to your phone 📲
        </p>
      )}
      {state.error && (
        <p className="text-sm text-red-600 mt-2">{state.error}</p>
      )}
    </form>
  )
}

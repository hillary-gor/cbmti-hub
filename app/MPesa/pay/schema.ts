import { z } from "zod"

export const paymentSchema = z.object({
  phone: z
    .string()
    .regex(/^2547\d{8}$/, "Phone must be a valid Safaricom number starting with 2547"),
  amount: z
    .string()
    .regex(/^\d+$/, "Amount must be a number")
    .transform((val) => parseFloat(val)),
})

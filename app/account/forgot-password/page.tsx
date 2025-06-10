"use client";

import { useState } from "react";
import { sendResetPasswordEmail } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputEmail = formData.get("email") as string;
    setEmail(inputEmail);

    const result = await sendResetPasswordEmail(formData);

    setStatus(result.success ? "sent" : "error");
    setMessage(result.message);

    if (result.success) {
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
        Forgot Password
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400"
        />
        <Button type="submit" className="w-full bg-[#329EE8] text-white">
          Send Reset Link
        </Button>
      </form>

      {/* Fallback message (error) */}
      {status === "error" && (
        <p className="mt-4 text-sm text-center text-red-600">{message}</p>
      )}

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-sm text-center border border-gray-200 dark:border-zinc-700 shadow-lg">
          <DialogHeader >
            <CheckCircle className="mx-auto text-green-500 h-10 w-10 mb-2" />
            <DialogTitle className="text-lg font-semibold mb-1 dark:text-white text-center">Check your email</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground dark:text-green-500 text-center">
              A confirmation link has been sent to <strong>{email}</strong>.
              <br />
              Click the link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 w-full text-[#329EE8] font-medium text-sm hover:underline"
          >
            Back to Login
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

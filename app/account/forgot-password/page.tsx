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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-gray-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm md:max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 sm:p-8 py-8 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            aria-label="Your email address"
            className="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:border-transparent transition duration-200"
          />
          <Button
            type="submit"
            className="w-full bg-[#329EE8] hover:bg-[#2586c9] text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Send Reset Link
          </Button>
        </form>

        {/* Fallback message (error) */}
        {status === "error" && (
          <p className="mt-4 text-sm text-center text-red-600 dark:text-red-400">
            {message}
          </p>
        )}

        {/* Confirmation Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="bg-white dark:bg-zinc-900 rounded-xl p-6 sm:p-8 w-full max-w-xs sm:max-w-sm text-center border border-gray-200 dark:border-zinc-700 shadow-lg animate-in fade-in-90 zoom-in-95">
            <DialogHeader>
              <CheckCircle className="mx-auto text-green-500 h-12 w-12 mb-4" />
              <DialogTitle className="text-xl font-semibold mb-2 dark:text-white text-center">
                Check your email
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground dark:text-gray-300 text-center leading-relaxed">
                A confirmation link has been sent to{" "}
                <strong className="text-gray-900 dark:text-white">
                  {email}
                </strong>
                .
                <br />
                Click the link to reset your password.
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full text-[#329EE8] font-medium text-base hover:underline focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:ring-offset-2 rounded-md transition duration-200"
            >
              Back to Login
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

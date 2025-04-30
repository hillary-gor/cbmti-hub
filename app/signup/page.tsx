"use client";

import { useState, useTransition } from "react";
import { signUpWithEmailPassword } from "./actions";
import { LoadingButton } from "@/components/ui/loading-button";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { CheckCircle } from "lucide-react";

const logoUrl =
  "https://gowiaewbjsdsvihqmsyg.supabase.co/storage/v1/object/public/assets/logo.svg";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await signUpWithEmailPassword(formData);

      if (result?.success) {
        setEmail(result.email);
        setShowModal(true);
        setError("");
      } else {
        setError(result?.error || "Something went wrong");
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background px-4">
      <div className="w-full max-w-sm space-y-6 bg-white dark:bg-zinc-900 shadow-xl p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src={logoUrl}
            alt="CBMTI Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>

        {/* Heading */}
        <div className="text-center text-lg font-bold text-gray-800 dark:text-white">
          Join CBMTI eHub
        </div>

        {/* Signup Form */}
        <form className="space-y-4" action={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#329EE8] focus:border-[#329EE8] transition"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[#329EE8] focus:border-[#329EE8] transition"
            />
          </div>

          <LoadingButton
            logoUrl={logoUrl}
            type="submit"
            disabled={isPending}
            className="w-full bg-[#329EE8] hover:bg-[#258ed2] text-white"
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </LoadingButton>

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>

        <div className="pt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="text-[#329EE8] hover:underline">
            Log In
          </a>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-full max-w-sm text-center border border-gray-200 dark:border-zinc-700 shadow-lg">
            <CheckCircle className="mx-auto text-green-500 h-10 w-10 mb-2" />
            <h2 className="text-lg font-semibold mb-1">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              A confirmation link has been sent to <strong>{email}</strong>.
              <br />
              Click the link to verify your email and activate your account.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-[#329EE8] font-medium text-sm hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

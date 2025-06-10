"use client";

import { Button } from "@/components/ui/button";
import { loginWithEmailPassword, loginWithGoogle } from "./actions";
import { LoadingButton } from "@/components/ui/loading-button";
import Image from "next/image";

const logoUrl =
  "https://gowiaewbjsdsvihqmsyg.supabase.co/storage/v1/object/public/assets/logo.svg";

const illustrationUrl =
  "https://gowiaewbjsdsvihqmsyg.supabase.co/storage/v1/object/public/assets//sandra-janet-joan.JPG";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-background">
      {/* Left Image Section */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src={illustrationUrl}
          alt="Login Illustration"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 relative flex items-center justify-center p-6">
        {/* Top-right Register Link */}
        <div className="absolute top-4 right-4 flex items-center gap-1 text-sm">
          <span className="text-gray-600 dark:text-gray-300">
            Don’t have an account?
          </span>
          <a href="/signup">
            <Button variant="link" size="sm" className="text-[#329EE8] px-0">
              Register
            </Button>
          </a>
        </div>

        <div className="w-full max-w-sm space-y-6 bg-white dark:bg-zinc-900 shadow-xl p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={logoUrl}
              alt="CBMTI eHub Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>

          {/* Heading */}
          <div className="text-center text-lg font-bold text-gray-800 dark:text-white">
            Access your eHub account
          </div>

          {/* Email + Password Login + Forgot Password */}
          <form className="space-y-4" action={loginWithEmailPassword}>
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
                autoComplete="email"
                required
                className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:border-[#329EE8] transition"
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
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:border-[#329EE8] transition"
              />
            </div>

            <div className="text-right">
              <a
                href="/reset-password"
                className="text-sm text-[#329EE8] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <LoadingButton
              logoUrl={logoUrl}
              type="submit"
              className="w-full bg-[#329EE8] hover:bg-[#258ed2] text-white"
            >
              Log In
            </LoadingButton>
          </form>

          {/* Magic Link 
          <form
            className="space-y-4 pt-6 border-t border-gray-200 dark:border-zinc-800"
            action={loginWithMagicLink}
          >
            <div className="space-y-2">
              <label
                htmlFor="magic-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Or log in via magic link
              </label>
              <input
                id="magic-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#329EE8] focus:border-[#329EE8] transition"
              />
            </div>

            <LoadingButton
              logoUrl={logoUrl}
              type="submit"
              variant="outline"
              className="w-full border-[#329EE8] text-[#329EE8] hover:bg-[#329EE8]/10"
            >
              Send Magic Link
            </LoadingButton>
          </form> */}

          {/* Google OAuth */}
          <form action={loginWithGoogle}>
            <LoadingButton
              logoUrl={logoUrl}
              type="submit"
              variant="outline"
              className="w-full border"
            >
              Continue with Google
            </LoadingButton>
          </form>
        </div>
      </div>
    </main>
  );
}

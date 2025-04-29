// app/error/page.tsx
"use client";

export default function GlobalErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground text-center">
        We encountered an unexpected error. Please try again later.
      </p>
    </div>
  );
}

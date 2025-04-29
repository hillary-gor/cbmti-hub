"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAuthUser } from "../actions";

export function CreateAuthUserForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createAuthUser(formData);
      if (result.success && result.userId) {
        router.push(
          `/dashboard/admin/legacy-students/update-profile/${result.userId}`,
        );
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Step 1: Create Student
      </h1>

      <div>
        <label className="block mb-1">Full Name</label>
        <input name="full_name" required className="input w-full" />
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input name="email" type="email" required className="input w-full" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full"
      >
        {isPending ? "Creating..." : "Next"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

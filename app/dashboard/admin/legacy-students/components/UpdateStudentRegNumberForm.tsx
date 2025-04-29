"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStudentRegNumber } from "../actions";

export function UpdateStudentRegNumberForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [regNumber, setRegNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateStudentRegNumber(userId, regNumber);
      if (result.success) {
        // ✅ No more onSuccess prop — handle routing here directly
        router.push("/dashboard/admin/legacy-students");
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Step 3: Assign Registration Number
      </h1>

      <div>
        <label className="block mb-1">Registration Number</label>
        <input
          type="text"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value)}
          required
          className="input w-full"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full"
      >
        {isPending ? "Assigning..." : "Finish"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

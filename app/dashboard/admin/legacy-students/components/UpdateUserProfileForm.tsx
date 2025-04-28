"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "../actions";

export function UpdateUserProfileForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const phone = formData.get("phone")?.toString() ?? "";
    const gender = formData.get("gender")?.toString() as
      | "Male"
      | "Female"
      | "Other";
    const dob = formData.get("dob")?.toString() ?? "";
    const location = formData.get("location")?.toString() ?? "";
    const role = formData.get("role")?.toString() as
      | "student"
      | "admin"
      | "lecturer";

    const data = { phone, gender, dob, location, role };

    startTransition(async () => {
      const result = await updateUserProfile(userId, data);
      if (result.success) {
        router.push(`/dashboard/admin/legacy-students/assign-reg/${userId}`);
      } else {
        setError(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={isPending} className="space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Step 2: Complete Profile
        </h1>

        <div>
          <label htmlFor="phone" className="block mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            required
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block mb-1">
            Gender
          </label>
          <select id="gender" name="gender" required className="input w-full">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="dob" className="block mb-1">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            name="dob"
            required
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-1">
            Location
          </label>
          <input
            id="location"
            type="text"
            name="location"
            required
            className="input w-full"
          />
        </div>

        <div>
          <label htmlFor="role" className="block mb-1">
            Role
          </label>
          <select id="role" name="role" required className="input w-full">
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          {isPending ? "Saving..." : "Next"}
        </button>
      </fieldset>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}

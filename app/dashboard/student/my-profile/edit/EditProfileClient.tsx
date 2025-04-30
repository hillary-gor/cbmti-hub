"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStudentProfile } from "./actions";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  full_name: z.string().min(2),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  town_city: z.string().optional(),
  postal_code: z.string().optional(),
  nationality: z.string().optional(),
  national_id: z.string().optional(),
  marital_status: z.string().optional(),
  religion: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditProfileClient({ initialData }: { initialData: FormData }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchReligion = watch("religion");
  const watchMaritalStatus = watch("marital_status");

  const [customReligion, setCustomReligion] = useState("");
  const [customMarital, setCustomMarital] = useState("");

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    const dataToSend = {
      ...data,
      religion: data.religion === "Other" ? customReligion : data.religion,
      marital_status: data.marital_status === "Other" ? customMarital : data.marital_status,
    };

    const form = new FormData();
    Object.entries(dataToSend).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value);
      }
    });

    const result = await updateStudentProfile(form);

    if ("error" in result) {
      setError(result.error ?? "Something went wrong.");
    } else {
      setSuccess(true);
      router.push("/dashboard/student/my-profile");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#0049AB]">Edit Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Input label="Full Name" {...register("full_name")} error={errors.full_name?.message} />
        <Input label="Phone Number" {...register("phone_number")} />
        <Input label="Town/City" {...register("town_city")} />
        <Input label="Address" {...register("address")} />
        <Input label="Postal Code" {...register("postal_code")} />
        <Input label="Nationality" {...register("nationality")} />
        <Input label="National ID" {...register("national_id")} />

        {/* Marital Status */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Marital Status</label>
          <select
            {...register("marital_status")}
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
          >
            <option value="">-- Select --</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Other">Other</option>
          </select>
          {watchMaritalStatus === "Other" && (
            <input
              type="text"
              placeholder="Enter your marital status"
              value={customMarital}
              onChange={(e) => setCustomMarital(e.target.value)}
              className="mt-2 w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
            />
          )}
        </div>

        {/* Religion */}
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Religion</label>
          <select
            {...register("religion")}
            className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
          >
            <option value="">-- Select --</option>
            <option value="Christian">Christian</option>
            <option value="Muslim">Muslim</option>
            <option value="Hindu">Hindu</option>
            <option value="Other">Other</option>
          </select>
          {watchReligion === "Other" && (
            <input
              type="text"
              placeholder="Enter your religion"
              value={customReligion}
              onChange={(e) => setCustomReligion(e.target.value)}
              className="mt-2 w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
            />
          )}
        </div>

        {/* Errors / Status */}
        {error && (
          <div className="col-span-full text-red-600 text-sm">{error}</div>
        )}
        {success && (
          <div className="col-span-full text-green-600 text-sm">Profile updated successfully.</div>
        )}

        <div className="col-span-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#0049AB] text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="col-span-1">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

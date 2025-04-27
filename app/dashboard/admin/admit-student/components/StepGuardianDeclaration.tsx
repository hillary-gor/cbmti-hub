"use client";

import { useFormContext, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { admitStudentSchema } from "../admit-student-zod-schema";

type FormData = z.infer<typeof admitStudentSchema>;

const StepGuardianDeclaration = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const guardianErrors = errors.guardian_declaration as FieldErrors<
    FormData["guardian_declaration"]
  >;

  const getErrorMessage = <T extends keyof FormData["guardian_declaration"]>(
    field: T,
  ) => {
    const error = guardianErrors?.[field];
    return typeof error?.message === "string" ? error.message : null;
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          {...register("guardian_declaration.guardian_full_name")}
          className="input"
          placeholder="Guardian Full Name"
        />
        <p className="text-red-500 text-sm">
          {getErrorMessage("guardian_full_name")}
        </p>
      </div>

      <div>
        <input
          {...register("guardian_declaration.guardian_id_number")}
          className="input"
          placeholder="ID Number"
        />
        <p className="text-red-500 text-sm">
          {getErrorMessage("guardian_id_number")}
        </p>
      </div>

      <div>
        <input
          {...register("guardian_declaration.guardian_email")}
          className="input"
          placeholder="Email"
        />
        <p className="text-red-500 text-sm">
          {getErrorMessage("guardian_email")}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("guardian_declaration.guardian_agrees_to_terms")}
        />
        <label>Guardian agrees to terms</label>
      </div>
      <p className="text-red-500 text-sm">
        {getErrorMessage("guardian_agrees_to_terms")}
      </p>
    </div>
  );
};

export default StepGuardianDeclaration;

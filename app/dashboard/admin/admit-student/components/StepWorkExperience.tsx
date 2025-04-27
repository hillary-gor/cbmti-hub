"use client";
import { useFormContext, useFieldArray } from "react-hook-form";

const StepWorkExperience = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "work_experience",
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border-b pb-4 mb-4">
          <input
            {...register(`work_experience.${index}.employer`)}
            className="input"
            placeholder="Employer"
          />
          <input
            {...register(`work_experience.${index}.designation`)}
            className="input"
            placeholder="Designation"
          />
          <input
            {...register(`work_experience.${index}.from_year`)}
            type="number"
            className="input"
            placeholder="From Year"
          />
          <input
            {...register(`work_experience.${index}.to_year`)}
            type="number"
            className="input"
            placeholder="To Year"
          />
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => append({})}>
        Add Work Experience
      </button>
    </div>
  );
};

export default StepWorkExperience;

'use client';
import { useFormContext, useFieldArray } from 'react-hook-form';

export const StepEducationBackground = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education_background',
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border-b pb-4 mb-4">
          <input {...register(`education_background.${index}.school_name`)} className="input" placeholder="School Name" />
          <input {...register(`education_background.${index}.qualification`)} className="input" placeholder="Qualification" />
          <input {...register(`education_background.${index}.examining_body`)} className="input" placeholder="Examining Body" />
          <input {...register(`education_background.${index}.from_year`)} type="number" className="input" placeholder="From Year" />
          <input {...register(`education_background.${index}.to_year`)} type="number" className="input" placeholder="To Year" />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => append({})}>Add Education</button>
    </div>
  );
};

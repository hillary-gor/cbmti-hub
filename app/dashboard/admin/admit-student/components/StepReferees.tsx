'use client';
import { useFormContext, useFieldArray } from 'react-hook-form';

export const StepReferees = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referees',
  });

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border-b pb-4 mb-4">
          <input {...register(`referees.${index}.full_name`)} className="input" placeholder="Full Name" />
          <input {...register(`referees.${index}.email`)} className="input" placeholder="Email" />
          <input {...register(`referees.${index}.phone_number`)} className="input" placeholder="Phone Number" />
          <input {...register(`referees.${index}.address`)} className="input" placeholder="Address" />
          <input {...register(`referees.${index}.town_city`)} className="input" placeholder="Town/City" />
          <input {...register(`referees.${index}.postal_code`)} className="input" placeholder="Postal Code" />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => append({})}>Add Referee</button>
    </div>
  );
};

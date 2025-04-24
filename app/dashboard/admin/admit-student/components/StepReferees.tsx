'use client';

import { useFormContext, useFieldArray, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

const StepReferees = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'referees',
  });

  const refErrors = errors.referees as
    | FieldErrors<FormData['referees'][number]>[]
    | undefined;

  const getErrorMessage = <T extends keyof FormData['referees'][number]>(
    index: number,
    field: T
  ) => {
    const error = refErrors?.[index]?.[field];
    return typeof error?.message === 'string' ? error.message : null;
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border-b pb-4 mb-4">
          <div>
            <input
              {...register(`referees.${index}.full_name`)}
              className="input"
              placeholder="Full Name"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'full_name')}
            </p>
          </div>
          <div>
            <input
              {...register(`referees.${index}.email`)}
              className="input"
              placeholder="Email"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'email')}
            </p>
          </div>
          <div>
            <input
              {...register(`referees.${index}.phone_number`)}
              className="input"
              placeholder="Phone Number"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'phone_number')}
            </p>
          </div>
          <div>
            <input
              {...register(`referees.${index}.address`)}
              className="input"
              placeholder="Address"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'address')}
            </p>
          </div>
          <div>
            <input
              {...register(`referees.${index}.town_city`)}
              className="input"
              placeholder="Town/City"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'town_city')}
            </p>
          </div>
          <div>
            <input
              {...register(`referees.${index}.postal_code`)}
              className="input"
              placeholder="Postal Code"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'postal_code')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-sm text-red-600 underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        className="btn"
        onClick={() =>
          append({
            full_name: '',
            email: '',
            phone_number: '',
            address: '',
            town_city: '',
            postal_code: '',
          })
        }
      >
        + Add Referee
      </button>
    </div>
  );
};

export default StepReferees;

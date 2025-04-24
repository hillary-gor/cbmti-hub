'use client';

import { useFormContext, useFieldArray, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

const StepEducationBackground = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'education_background',
  });

  const eduErrors = errors.education_background as
    | FieldErrors<FormData['education_background'][number]>[]
    | undefined;

  const getErrorMessage = <T extends keyof FormData['education_background'][number]>(
    index: number,
    field: T
  ) => {
    const error = eduErrors?.[index]?.[field];
    return typeof error?.message === 'string' ? error.message : null;
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 border-b pb-4 mb-4">
          <div>
            <input
              {...register(`education_background.${index}.school_name`)}
              className="input"
              placeholder="School Name"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'school_name')}
            </p>
          </div>
          <div>
            <input
              {...register(`education_background.${index}.qualification`)}
              className="input"
              placeholder="Qualification"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'qualification')}
            </p>
          </div>
          <div>
            <input
              {...register(`education_background.${index}.examining_body`)}
              className="input"
              placeholder="Examining Body"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'examining_body')}
            </p>
          </div>
          <div>
            <input
              {...register(`education_background.${index}.from_year`)}
              type="number"
              className="input"
              placeholder="From Year"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'from_year')}
            </p>
          </div>
          <div>
            <input
              {...register(`education_background.${index}.to_year`)}
              type="number"
              className="input"
              placeholder="To Year"
            />
            <p className="text-red-500 text-sm">
              {getErrorMessage(index, 'to_year')}
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
            school_name: '',
            qualification: '',
            examining_body: '',
            from_year: new Date().getFullYear(),
            to_year: new Date().getFullYear(),
          })
        }
      >
        + Add Education
      </button>
    </div>
  );
};

export default StepEducationBackground;

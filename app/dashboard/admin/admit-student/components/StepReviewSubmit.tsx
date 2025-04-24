'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

const StepReviewSubmit = () => {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Review your information before submitting:</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm text-gray-800 dark:text-gray-200 overflow-auto max-h-[400px]">
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
    </div>
  );
};

export default StepReviewSubmit;

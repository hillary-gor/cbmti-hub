'use client';
import { useFormContext } from 'react-hook-form';

export const StepReviewSubmit = () => {
  const { getValues } = useFormContext();
  const values = getValues();

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Review your information before submitting:</h3>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
};

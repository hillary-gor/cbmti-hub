'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

export default function StepPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const getErrorMessage = (fieldName: keyof FormData) => {
    const error = errors[fieldName];
    return typeof error?.message === 'string' ? error.message : null;
  };

  // Fields where we know the names are keys of FormData
  const fields: { label: string; name: keyof FormData; type?: string; optional?: boolean }[] = [
    { label: 'Full Name', name: 'full_name' },
    { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
    { label: 'National ID', name: 'national_id' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Phone Number', name: 'phone_number' },
    { label: 'Religion', name: 'religion', optional: true },
    { label: 'Address', name: 'address' },
    { label: 'Postal Code', name: 'postal_code', optional: true },
    { label: 'Town / City', name: 'town_city', optional: true },
    { label: 'Nationality', name: 'nationality' },
    { label: 'Merged File URL', name: 'merged_file_url', type: 'url', optional: true },
  ];

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block font-medium">{field.label}</label>
          <input
            type={field.type ?? 'text'}
            {...register(field.name)}
            className="input w-full"
          />
          {!field.optional && (
            <p className="text-red-500 text-sm mt-1">
              {getErrorMessage(field.name)}
            </p>
          )}
        </div>
      ))}

      <div>
        <label className="block font-medium">Gender</label>
        <select {...register('gender')} className="input w-full">
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <p className="text-red-500 text-sm mt-1">{getErrorMessage('gender')}</p>
      </div>

      <div>
        <label className="block font-medium">Marital Status</label>
        <select {...register('marital_status')} className="input w-full">
          {['Single', 'Married', 'Divorced', 'Other'].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <p className="text-red-500 text-sm mt-1">{getErrorMessage('marital_status')}</p>
      </div>
    </div>
  );
}

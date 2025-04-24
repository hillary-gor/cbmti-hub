'use client';

import { useFormContext, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

const StepContacts = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const nextOfKinErrors = errors.next_of_kin as FieldErrors<FormData['next_of_kin']>;
  const emergencyErrors = errors.emergency_contact as FieldErrors<FormData['emergency_contact']>;

  const getKinError = <T extends keyof FormData['next_of_kin']>(field: T) => {
    const message = nextOfKinErrors?.[field]?.message;
    return typeof message === 'string' ? message : null;
  };

  const getEmergencyError = <T extends keyof FormData['emergency_contact']>(field: T) => {
    const message = emergencyErrors?.[field]?.message;
    return typeof message === 'string' ? message : null;
  };

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="font-medium">Next of Kin</legend>
        <div>
          <input {...register('next_of_kin.full_name')} className="input" placeholder="Full Name" />
          <p className="text-red-500 text-sm">{getKinError('full_name')}</p>
        </div>
        <div>
          <input {...register('next_of_kin.relationship')} className="input" placeholder="Relationship" />
          <p className="text-red-500 text-sm">{getKinError('relationship')}</p>
        </div>
        <div>
          <input {...register('next_of_kin.phone_number')} className="input" placeholder="Phone Number" />
          <p className="text-red-500 text-sm">{getKinError('phone_number')}</p>
        </div>
        <div>
          <input {...register('next_of_kin.email')} className="input" placeholder="Email" />
          <p className="text-red-500 text-sm">{getKinError('email')}</p>
        </div>
        <div>
          <input {...register('next_of_kin.address')} className="input" placeholder="Address" />
          <p className="text-red-500 text-sm">{getKinError('address')}</p>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-medium">Emergency Contact</legend>
        <div>
          <input {...register('emergency_contact.full_name')} className="input" placeholder="Full Name" />
          <p className="text-red-500 text-sm">{getEmergencyError('full_name')}</p>
        </div>
        <div>
          <input {...register('emergency_contact.phone_number')} className="input" placeholder="Phone Number" />
          <p className="text-red-500 text-sm">{getEmergencyError('phone_number')}</p>
        </div>
        <div>
          <input {...register('emergency_contact.email')} className="input" placeholder="Email" />
          <p className="text-red-500 text-sm">{getEmergencyError('email')}</p>
        </div>
        <div>
          <input {...register('emergency_contact.address')} className="input" placeholder="Address" />
          <p className="text-red-500 text-sm">{getEmergencyError('address')}</p>
        </div>
      </fieldset>
    </div>
  );
};

export default StepContacts;

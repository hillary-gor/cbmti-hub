'use client';
import { useFormContext } from 'react-hook-form';

export const StepContacts = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="font-medium">Next of Kin</legend>
        <input {...register('next_of_kin.full_name')} className="input" placeholder="Full Name" />
        <input {...register('next_of_kin.relationship')} className="input" placeholder="Relationship" />
        <input {...register('next_of_kin.phone_number')} className="input" placeholder="Phone Number" />
        <input {...register('next_of_kin.email')} className="input" placeholder="Email" />
        <input {...register('next_of_kin.address')} className="input" placeholder="Address" />
      </fieldset>

      <fieldset>
        <legend className="font-medium">Emergency Contact</legend>
        <input {...register('emergency_contact.full_name')} className="input" placeholder="Full Name" />
        <input {...register('emergency_contact.phone_number')} className="input" placeholder="Phone Number" />
        <input {...register('emergency_contact.email')} className="input" placeholder="Email" />
        <input {...register('emergency_contact.address')} className="input" placeholder="Address" />
      </fieldset>
    </div>
  );
};

'use client';
import { useFormContext } from 'react-hook-form';

export const StepGuardianDeclaration = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <input {...register('guardian_declaration.guardian_full_name')} className="input" placeholder="Guardian Full Name" />
      <input {...register('guardian_declaration.guardian_id_number')} className="input" placeholder="ID Number" />
      <input {...register('guardian_declaration.guardian_email')} className="input" placeholder="Email" />
      <label>
        <input type="checkbox" {...register('guardian_declaration.guardian_agrees_to_terms')} />
        Guardian agrees to terms
      </label>
    </div>
  );
};

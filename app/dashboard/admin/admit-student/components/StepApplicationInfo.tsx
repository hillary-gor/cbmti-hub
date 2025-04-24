'use client';

import { useFormContext, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

const StepApplicationInfo = () => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();

  const disability = watch('application_info.disability_status');
  const appErrors = errors.application_info as FieldErrors<FormData['application_info']>;

  const getErrorMessage = <T extends keyof FormData['application_info']>(
    field: T
  ) => {
    const message = appErrors?.[field]?.message;
    return typeof message === 'string' ? message : null;
  };

  return (
    <div className="space-y-4">
      <input {...register('course_id')} type="hidden" />
      <input {...register('intake_id')} type="hidden" />
      <input {...register('department_id')} type="hidden" />

      <div>
        <label>Course</label>
        <input {...register('application_info.course')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('course')}</p>
      </div>

      <div>
        <label>Intake Month</label>
        <input {...register('application_info.intake_month')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('intake_month')}</p>
      </div>

      <div>
        <label>Intake Year</label>
        <input
          type="number"
          {...register('application_info.intake_year')}
          className="input"
        />
        <p className="text-red-500 text-sm">{getErrorMessage('intake_year')}</p>
      </div>

      <div>
        <label>Session</label>
        <input {...register('application_info.session')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('session')}</p>
      </div>

      <div>
        <label>Mode of Study</label>
        <input {...register('application_info.mode_of_study')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('mode_of_study')}</p>
      </div>

      <div>
        <label>Study Center</label>
        <input {...register('application_info.study_center')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('study_center')}</p>
      </div>

      <div>
        <label>Payment Method</label>
        <input {...register('application_info.payment_method')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('payment_method')}</p>
      </div>

      <div>
        <label>Payment Reference</label>
        <input {...register('application_info.payment_reference')} className="input" />
        <p className="text-red-500 text-sm">{getErrorMessage('payment_reference')}</p>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('application_info.disability_status')} />
        <label>Do you have a disability?</label>
      </div>

      {disability && (
        <div>
          <label>Disability Type</label>
          <input
            {...register('application_info.disability_type')}
            className="input"
            placeholder="e.g. Visual, Hearing, Physical..."
          />
          <p className="text-red-500 text-sm">{getErrorMessage('disability_type')}</p>
        </div>
      )}
    </div>
  );
};

export default StepApplicationInfo;

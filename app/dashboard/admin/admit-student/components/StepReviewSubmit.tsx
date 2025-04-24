'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { admitStudentSchema } from '../admit-student-zod-schema';

type FormData = z.infer<typeof admitStudentSchema>;

const StepReviewSubmit = () => {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review your application</h3>

      <ul className="space-y-4 text-sm">
        <li>
          <strong>Name:</strong> {values.full_name}
        </li>
        <li>
          <strong>Date of Birth:</strong> {values.date_of_birth}
        </li>
        <li>
          <strong>National ID:</strong> {values.national_id}
        </li>
        <li>
          <strong>Email:</strong> {values.email}
        </li>
        <li>
          <strong>Phone:</strong> {values.phone_number}
        </li>
        <li>
          <strong>Nationality:</strong> {values.nationality}
        </li>
        <li>
          <strong>Gender:</strong> {values.gender}
        </li>
        <li>
          <strong>Marital Status:</strong> {values.marital_status}
        </li>
        <li>
          <strong>Address:</strong> {values.address}, {values.town_city} {values.postal_code}
        </li>

        <li>
          <strong>Course Selected:</strong> {values.application_info.course || <span className="text-red-500">Missing</span>}
        </li>
        <li>
          <strong>Study Mode:</strong> {values.application_info.mode_of_study}
        </li>
        <li>
          <strong>Study Center:</strong> {values.application_info.study_center}
        </li>
        <li>
          <strong>Payment Ref:</strong> {values.application_info.payment_reference}
        </li>

        <li>
          <strong>Guardian:</strong> {values.guardian_declaration.guardian_full_name} ({values.guardian_declaration.guardian_email})
        </li>

        <li>
          <strong>Uploaded Document:</strong><br />
          {values.merged_file_url ? (
            <a href={values.merged_file_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              View Uploaded File
            </a>
          ) : (
            <span className="text-red-500">No file uploaded</span>
          )}
        </li>

        {/* Warn if UUIDs are missing */}
        {(!values.course_id || !values.intake_id || !values.department_id) && (
          <li className="text-red-600 font-medium">
            ⚠️ Missing course, intake, or department selection — cannot submit!
          </li>
        )}
      </ul>
    </div>
  );
};

export default StepReviewSubmit;

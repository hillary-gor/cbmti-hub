import { EnrollmentForm } from './form';
import { getRegisterPageData } from '../../data';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

type PageProps = {
  params: { intakeId: string };
};

export default async function RegisterPage({ params }: PageProps) {
  const data = await getRegisterPageData(params.intakeId);

  if (!data?.intake) notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Register Student – {data.intake.label}
        </h1>
        <p className="text-sm text-muted-foreground">
          Intake window:{' '}
          {format(new Date(data.intake.opens_on), 'dd MMM yyyy')} →{' '}
          {format(new Date(data.intake.closes_on), 'dd MMM yyyy')}
        </p>
      </div>

      <EnrollmentForm
        intakeId={data.intake.id}
        students={data.students}
        courses={data.courses}
      />
    </div>
  );
}

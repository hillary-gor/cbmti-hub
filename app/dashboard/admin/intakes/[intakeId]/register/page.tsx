import { EnrollmentForm } from './form';
import { getRegisterPageData } from '../../data';
import { notFound } from 'next/navigation';

type PageProps = {
  params: { intakeId: string };
};

export default async function RegisterPage({ params }: PageProps) {
  const data = await getRegisterPageData(params.intakeId);

  if (!data?.intake) notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Register Student - {data.intake.label}</h1>
        <p className="text-sm text-muted-foreground">
          Intake window: {data.intake.opens_on} → {data.intake.closes_on}
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

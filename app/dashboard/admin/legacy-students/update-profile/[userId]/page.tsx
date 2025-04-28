import { UpdateUserProfileForm } from "../../components/UpdateUserProfileForm";

type PageProps = {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params }: PageProps) {
  const awaitedParams = await params;
  const { userId } = awaitedParams;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <UpdateUserProfileForm userId={userId} />
    </div>
  );
}

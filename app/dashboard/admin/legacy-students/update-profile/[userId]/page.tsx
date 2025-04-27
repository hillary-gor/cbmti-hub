"use client";

import { UpdateUserProfileForm } from "../../components/UpdateUserProfileForm";

export default function Page({ }: { params: { userId: string } }) {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <UpdateUserProfileForm userId={""} />
    </div>
  );
}

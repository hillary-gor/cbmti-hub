"use client";

import { UpdateStudentRegNumberForm } from "../../components/UpdateStudentRegNumberForm";

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <UpdateStudentRegNumberForm userId={params.userId} />
    </div>
  );
}

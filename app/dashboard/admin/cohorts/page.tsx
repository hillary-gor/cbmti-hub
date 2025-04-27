// app/dashboard/admin/cohorts/page.tsx

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminCohortsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("intakes")
    .select("id, label, opens_on")
    .order("opens_on", { ascending: false });

  if (error) {
    console.error("[ADMIN_COHORTS_ERROR]", error.message);
    return <div className="text-red-600">⚠️ Failed to load intakes</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Intakes</h1>
        <Button asChild>
          <Link href="/dashboard/admin/cohorts/new">➕ Add Intake</Link>
        </Button>
      </div>

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border">Label</th>
            <th className="p-3 border">Opens On</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((intake) => (
            <tr key={intake.id} className="border-t">
              <td className="p-3">{intake.label}</td>
              <td className="p-3">
                {new Date(intake.opens_on).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

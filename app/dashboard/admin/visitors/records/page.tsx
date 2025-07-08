import { Suspense } from "react";
import { getVisitors } from "../actions";
import VisitorRecordsList from "./components/VisitorRecordsList";

export const metadata = {
  title: "Visitor Records | Admin Dashboard",
  description: "View and manage all visitor check-in records.",
};

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export default async function VisitorRecordsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;

  const { status, startDate, endDate, searchTerm } = resolvedSearchParams || {};

  const statusRaw = Array.isArray(status) ? status[0] : status;
  const currentStartDate = Array.isArray(startDate)
    ? startDate[0]
    : startDate ?? "";
  const currentEndDate = Array.isArray(endDate) ? endDate[0] : endDate ?? "";
  const currentSearchTerm = Array.isArray(searchTerm)
    ? searchTerm[0]
    : searchTerm ?? "";

  const validStatus: "checked_out" | "all" | "checked_in" =
    statusRaw === "checked_out"
      ? "checked_out"
      : statusRaw === "all"
      ? "all"
      : "checked_in";

  const { visitors, error } = await getVisitors(
    validStatus,
    currentStartDate,
    currentEndDate
  );

  if (error) {
    console.error("Error loading visitors in page.tsx:", error);
    return (
      <div className="p-8 text-red-700 bg-red-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Error loading visitors:</h2>
        <p>{error}</p>
        <p>
          Please ensure you are logged in as an administrator and RLS policies
          are correct.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center">
          Visitor Records
        </h1>
        <p className="mt-2 text-lg text-gray-600 text-center">
          Manage and review all visitor check-in and check-out data.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <Suspense fallback={<div>Loading records...</div>}>
          <VisitorRecordsList
            initialVisitors={visitors || []}
            currentFilter={validStatus}
            currentStartDate={currentStartDate}
            currentEndDate={currentEndDate}
            currentSearchTerm={currentSearchTerm}
          />
        </Suspense>
      </main>
    </div>
  );
}

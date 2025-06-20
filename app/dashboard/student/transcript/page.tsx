import { createClient } from "@/utils/supabase/server";

export default async function TranscriptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <p className="p-6 text-red-600">Not logged in.</p>;

  const { data: grades, error } = await supabase
    .from("grades")
    .select(
      `
      final_score,
      grade,
      remark,
      average_cat,
      cat1,
      cat2,
      cat3,
      cat4,
      fqe,
      sup_fqe,
      course_id,
      credit_earned,
      created_at,
      courses (
        title,
        code
      )
    `
    )
    .eq("student_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Transcript fetch error", error);
    return <p className="p-6 text-red-600">Error loading transcript.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#acd0ff] dark:text-white">
        Detailed Academic Transcript
      </h1>
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 text-[#0049AB] dark:text-white">
          CAT Performance
        </h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600 dark:text-gray-300">
              <th className="py-3 px-4">Course Code</th>
              <th className="py-3 px-4">Course Title</th>
              <th className="py-3 px-4">CAT 1</th>
              <th className="py-3 px-4">CAT 2</th>
              <th className="py-3 px-4">CAT 3</th>
              <th className="py-3 px-4">CAT 4</th>
              <th className="py-3 px-4">CAT Average</th>
            </tr>
          </thead>
          <tbody>
            {grades?.map((row, idx) => {
              const course = Array.isArray(row.courses)
                ? row.courses[0]
                : row.courses;
              return (
                <tr
                  key={`cat-row-${idx}`}
                  className="border-t dark:border-zinc-700 text-gray-800 dark:text-white"
                >
                  <td className="py-2 px-4">{course?.code ?? "N/A"}</td>
                  <td className="py-2 px-4">{course?.title ?? "Unknown"}</td>
                  <td className="py-2 px-4">{row.cat1 ?? "-"}</td>
                  <td className="py-2 px-4">{row.cat2 ?? "-"}</td>
                  <td className="py-2 px-4">{row.cat3 ?? "-"}</td>
                  <td className="py-2 px-4">{row.cat4 ?? "-"}</td>
                  <td className="py-2 px-4">{row.average_cat ?? "-"}</td>
                </tr>
              );
            })}
            {!grades?.length && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Your CAT results are not yet updated, please check back later.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {grades?.length > 0 && (
          <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
            {grades.map((row, idx) => {
              const course = Array.isArray(row.courses)
                ? row.courses[0]
                : row.courses;
              const courseCode = course?.code ?? "N/A";
              const catAverage = row.average_cat;

              if (catAverage !== null && catAverage !== undefined) {
                if (catAverage < 80) {
                  return (
                    <p key={`cat-remark-${idx}`} className="mb-1 last:mb-0">
                      <span className="font-semibold">{courseCode}:</span> You
                      did not meet the 80% required CATs average. You will have
                      to pay for supplementary before sitting for your FQE.
                    </p>
                  );
                } else {
                  return (
                    <p key={`cat-remark-${idx}`} className="mb-1 last:mb-0">
                      <span className="font-semibold">{courseCode}:</span> You
                      have passed so far, smile! The only exam left is FQE.
                    </p>
                  );
                }
              }
              return null;
            })}
            {grades.every(
              (row) => row.average_cat === null || row.average_cat === undefined
            ) && <p>No CAT average data available for specific remarks.</p>}
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold p-4 text-[#0049AB] dark:text-white">
        Overal Academic Performance
      </h2>
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-600 dark:text-gray-300">
              <th className="py-3 px-4">Course Code</th>
              <th className="py-3 px-4">Course Title</th>
              <th className="py-3 px-4">CAT Avg</th>
              <th className="py-3 px-4">FQE</th>
              <th className="py-3 px-4">Final Score</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Remark</th>
              <th className="py-3 px-4">Credits</th>
            </tr>
          </thead>
          <tbody>
            {grades?.map((row, idx) => {
              const course = Array.isArray(row.courses)
                ? row.courses[0]
                : row.courses;
              return (
                <tr
                  key={`overall-row-${idx}`}
                  className="border-t dark:border-zinc-700 text-gray-800 dark:text-white"
                >
                  <td className="py-2 px-4">{course?.code ?? "N/A"}</td>
                  <td className="py-2 px-4">{course?.title ?? "Unknown"}</td>
                  <td className="py-2 px-4">{row.average_cat ?? "-"}</td>
                  <td className="py-2 px-4">{row.fqe ?? row.sup_fqe ?? "-"}</td>
                  <td className="py-2 px-4">{row.final_score ?? "-"}</td>
                  <td className="py-2 px-4">{row.grade ?? "-"}</td>
                  <td className="py-2 px-4">{row.remark ?? "-"}</td>
                  <td className="py-2 px-4">{row.credit_earned ?? "-"}</td>
                </tr>
              );
            })}
            {!grades?.length && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No transcript data available. Consider communicating with your
                  academic department.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {grades?.length > 0 && (
          <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
            {grades.map((row, idx) => {
              const course = Array.isArray(row.courses)
                ? row.courses[0]
                : row.courses;
              const courseTitle = course?.title ?? "Unknown Course";
              const fqeScore = row.sup_fqe !== null ? row.sup_fqe : row.fqe;

              let message = "";

              if (
                row.grade === "Fail" &&
                (fqeScore === null || fqeScore === undefined || fqeScore === 0)
              ) {
                message = `For ${courseTitle}: Your FQE is not yet updated.`;
              } else if (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore >= 60) {
                message = `For ${courseTitle}: You are all set for graduation!`;
              } else if (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore < 60) {
                message = `For ${courseTitle}: You did your best but you have not qualified for graduation. You will have to do your FQE supplementary to qualify.`;
              }

              return message ? <p key={`overall-remark-${idx}`} className="mb-1 last:mb-0">{message}</p> : null;
            })}
            {grades?.length > 0 && grades.every(row => {
                const fqeScore = row.sup_fqe !== null ? row.sup_fqe : row.fqe;
                const hasSpecificMessage =
                    (row.grade === "Fail" && (fqeScore === null || fqeScore === undefined || fqeScore === 0)) ||
                    (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore >= 60) ||
                    (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore < 60);
                return !hasSpecificMessage;
            }) && (
                <p>Overall academic remarks will appear here once your final results are processed.</p>
            )}
            {!grades?.length && (
              <p>No overall academic data available for remarks.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
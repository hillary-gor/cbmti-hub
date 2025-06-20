import { createClient } from "@/utils/supabase/server";
import React from 'react';

export default async function TranscriptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="p-6 text-red-600">Not logged in.</p>;
  }

  const { data, error } = await supabase
    .from("grades")
    .select(
      `
      id,
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
    console.error("Transcript fetch error:", error.message);
    return <p className="p-6 text-red-600">Error loading transcript. Please try again later.</p>;
  }

  let deduplicatedGrades = [];
  if (data) {
    const uniqueGradesMap = new Map();
    data.forEach(row => {
      uniqueGradesMap.set(row.course_id, row);
    });
    deduplicatedGrades = Array.from(uniqueGradesMap.values());
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-extrabold text-[#acd0ff] dark:text-white text-center">
        Detailed Academic Transcript
      </h1>

      {/* CAT Performance Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <h2 className="text-2xl font-bold p-5 bg-gradient-to-r from-[#0049AB] to-blue-700 text-white dark:from-zinc-800 dark:to-zinc-950 dark:text-[#acd0ff] rounded-t-xl">
          CAT Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Course Code</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Course Title</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">CAT 1</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">CAT 2</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">CAT 3</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">CAT 4</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">CAT Average</th>
              </tr>
            </thead>
            <tbody>
              {deduplicatedGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    Your CAT results are not yet updated, please check back later.
                  </td>
                </tr>
              ) : (
                deduplicatedGrades.map((row) => {
                  const course = Array.isArray(row.courses)
                    ? row.courses[0]
                    : row.courses;
                  return (
                    <tr
                      key={`cat-row-${row.id || row.course_id}`}
                      className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-150 ease-in-out odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-850"
                    >
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{course?.code ?? "N/A"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">{course?.title ?? "Unknown"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.cat1 ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.cat2 ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.cat3 ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.cat4 ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-semibold">{row.average_cat ?? "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Remarks for CAT Performance */}
        {deduplicatedGrades.length > 0 && (
          <div className="p-5 border-t border-gray-200 dark:border-zinc-700">
            {deduplicatedGrades.map((row) => {
              const course = Array.isArray(row.courses)
                ? row.courses[0]
                : row.courses;
              const courseCode = course?.code ?? "N/A";
              const catAverage = row.average_cat;

              let remarkContent = null;
              if (catAverage !== null && catAverage !== undefined) {
                if (catAverage < 80) {
                  remarkContent = (
                    <div key={`cat-remark-${row.id || row.course_id}`} className="flex items-start bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-2 last:mb-0 shadow-sm">
                      <span className="mr-2 text-lg">⚠️</span>
                      <p className="text-sm">
                        <span className="font-bold">{courseCode}:</span> You did not meet the 80% required CATs average. You will have to pay for supplementary before sitting for your FQE.
                      </p>
                    </div>
                  );
                } else {
                  remarkContent = (
                    <div key={`cat-remark-${row.id || row.course_id}`} className="flex items-start bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-3 rounded-md mb-2 last:mb-0 shadow-sm">
                      <span className="mr-2 text-lg">✅</span>
                      <p className="text-sm">
                        <span className="font-bold">{courseCode}:</span> You have passed so far, smile! The only exam left is FQE.
                      </p>
                    </div>
                  );
                }
              }
              return remarkContent;
            })}
            {deduplicatedGrades.every(
              (row) => row.average_cat === null || row.average_cat === undefined
            ) && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 rounded-md shadow-sm">
                <p className="text-sm">No CAT average data available for specific remarks.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overall Academic Performance Section */}
      <h2 className="text-2xl font-bold p-5 bg-gradient-to-r from-[#0049AB] to-blue-700 text-white dark:from-zinc-800 dark:to-zinc-950 dark:text-[#acd0ff] rounded-xl">
        Overall Academic Performance
      </h2>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Course Code</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Course Title</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">CAT Avg</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">FQE</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Final Score</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Grade</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Remark</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 font-semibold uppercase tracking-wider">Credits</th>
              </tr>
            </thead>
            <tbody>
              {deduplicatedGrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No transcript data available. Consider communicating with your
                    academic department.
                  </td>
                </tr>
              ) : (
                deduplicatedGrades.map((row) => {
                  const course = Array.isArray(row.courses)
                    ? row.courses[0]
                    : row.courses;
                  return (
                    <tr
                      key={`overall-row-${row.id || row.course_id}`}
                      className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-150 ease-in-out odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-850"
                    >
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{course?.code ?? "N/A"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">{course?.title ?? "Unknown"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.average_cat ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.fqe ?? row.sup_fqe ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-semibold">{row.final_score ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-semibold">
                        <span className={
                          `${row.grade === 'Pass' ? 'text-green-600 dark:text-green-400' :
                            row.grade === 'Fail' ? 'text-red-600 dark:text-red-400' :
                            'text-gray-600 dark:text-gray-400'}`
                        }>
                          {row.grade ?? "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.remark ?? "-"}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{row.credit_earned ?? "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Remarks for Overall Academic Performance */}
        {deduplicatedGrades.length > 0 && (
          <div className="p-5 border-t border-gray-200 dark:border-zinc-700">
            {deduplicatedGrades.map((row) => {
              const course = Array.isArray(row.courses)
                ? row.courses[0]
                : row.courses;
              const courseTitle = course?.title ?? "Unknown Course";
              const fqeScore = row.sup_fqe !== null ? row.sup_fqe : row.fqe;

              let message = "";
              let messageType = "info";

              if (
                row.grade === "Fail" &&
                (fqeScore === null || fqeScore === undefined || fqeScore === 0)
              ) {
                message = `For ${courseTitle}: Your FQE is not yet updated.`;
                messageType = "info";
              } else if (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore >= 60) {
                message = `For ${courseTitle}: You are all set for graduation!`;
                messageType = "success";
              } else if (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore < 60) {
                message = `For ${courseTitle}: You did your best but you have not qualified for graduation. You will have to do your FQE supplementary to qualify.`;
                messageType = "warning";
              }

              if (!message) return null;

              let messageClasses = "";
              let icon = "";
              switch (messageType) {
                case "success":
                  messageClasses = "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
                  icon = "✅";
                  break;
                case "warning":
                  messageClasses = "bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200";
                  icon = "⚠️";
                  break;
                case "info":
                default:
                  messageClasses = "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
                  icon = "ℹ️";
                  break;
              }

              return (
                <div key={`overall-remark-${row.id || row.course_id}`} className={`flex items-start p-3 rounded-md mb-2 last:mb-0 shadow-sm ${messageClasses}`}>
                  <span className="mr-2 text-lg">{icon}</span>
                  <p className="text-sm">{message}</p>
                </div>
              );
            })}
            {deduplicatedGrades.length > 0 && deduplicatedGrades.every(row => {
                const fqeScore = row.sup_fqe !== null ? row.sup_fqe : row.fqe;
                const hasSpecificMessage =
                    (row.grade === "Fail" && (fqeScore === null || fqeScore === undefined || fqeScore === 0)) ||
                    (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore >= 60) ||
                    (fqeScore !== null && fqeScore !== undefined && fqeScore > 0 && fqeScore < 60);
                return !hasSpecificMessage;
            }) && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 p-3 rounded-md shadow-sm">
                  <p className="text-sm">Overall academic remarks will appear here once your final results are processed.</p>
                </div>
            )}
            {!deduplicatedGrades.length && (
              <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 p-3 rounded-md shadow-sm">
                <p className="text-sm">No overall academic data available for remarks.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
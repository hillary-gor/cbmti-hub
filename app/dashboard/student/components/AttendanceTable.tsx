"use client";

export function AttendanceTable({
  attendance,
}: {
  attendance: { date: string; status: string }[];
}) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">📅 Attendance</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{record.date}</td>
              <td
                className={`py-2 font-medium ${record.status === "Present" ? "text-green-600" : "text-red-500"}`}
              >
                {record.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

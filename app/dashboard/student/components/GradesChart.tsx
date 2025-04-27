"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function GradesChart({
  grades,
}: {
  grades: { subject: string; score: number }[];
}) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">🎓 My Grades</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={grades}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

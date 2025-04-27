"use client";

export function FeeBalanceSummary({
  fees,
}: {
  fees: { amount_due: number; due_date: string }[];
}) {
  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">💵 My Fee Balances</h2>
      <ul className="space-y-2">
        {fees.map((fee, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>Ksh {fee.amount_due.toLocaleString()}</span>
            <span className="text-muted-foreground">Due: {fee.due_date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

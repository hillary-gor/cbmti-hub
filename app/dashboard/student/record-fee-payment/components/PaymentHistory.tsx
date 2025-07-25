"use client";

import React, { useState } from "react";
import { FeePayment, PaymentStatus } from "@/types/fee_payment";
import { format } from "date-fns";

interface PaymentHistoryProps {
  payments: FeePayment[];
  totalApprovedPayments: number;
  isLoadingApprovedSum?: boolean;
}

export default function PaymentHistory({
  payments,
  totalApprovedPayments,
  isLoadingApprovedSum,
}: PaymentHistoryProps) {
  const [filter, setFilter] = useState<PaymentStatus | "all">("all");

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Previous Payments
      </h2>

      {/* Display Total Approved Payments */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">
          Total Approved Payments:
        </h3>
        {isLoadingApprovedSum ? (
          <p className="text-green-700 text-xl font-bold">Loading...</p>
        ) : (
          <p className="text-green-700 text-xl font-bold">
            Ksh {totalApprovedPayments.toFixed(2)}
          </p>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === "all"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === "pending"
              ? "bg-yellow-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === "approved"
              ? "bg-green-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter("declined")}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === "declined"
              ? "bg-red-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Declined
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No payments found for the selected filter.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Reference
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Source
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const dateTimeString = payment.parsed_time
                  ? `${payment.parsed_date}T${payment.parsed_time}`
                  : payment.parsed_date;

                let displayDateTime;
                try {
                  if (payment.parsed_time) {
                    const formatString = "dd/MM/yyyy hh:mm aa";
                    displayDateTime = format(
                      new Date(dateTimeString),
                      formatString,
                    );
                  } else {
                    // Changed format for bank payments to "dd/MM/yyyy" only
                    const formatString = "dd/MM/yyyy";
                    displayDateTime = format(
                      new Date(dateTimeString),
                      formatString,
                    );
                  }
                } catch (error) {
                  console.error(
                    "Error during date formatting for payment ID:",
                    payment.id,
                    "Error:",
                    error,
                  );
                  console.log("Problematic dateTimeString:", dateTimeString);
                  displayDateTime = "Error Formatting Date";
                }

                return (
                  <tr
                    key={payment.id}
                    className={
                      payment.status === "approved"
                        ? "bg-gray-50 text-gray-500"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {displayDateTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Ksh {payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payment.source || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : payment.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// app/dashboard/student/record-fee-payment/components/PaymentHistory.tsx
'use client';

import React, { useState } from 'react';
import { FeePayment, PaymentStatus } from '@/types/fee_payment'; // Corrected path to types
import { format } from 'date-fns';

interface PaymentHistoryProps {
  payments: FeePayment[];
}

export default function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Previous Payments</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === 'approved'
              ? 'bg-green-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setFilter('declined')}
          className={`py-2 px-4 rounded-lg text-sm font-semibold transition duration-200 ${
            filter === 'declined'
              ? 'bg-red-600 text-white shadow'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Declined
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No payments found for the selected filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className={payment.status === 'approved' ? 'bg-gray-50 text-gray-500' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {/* Changed 'YYYY' to 'yyyy' for correct year formatting */}
                    {format(new Date(`${payment.parsed_date}T${payment.parsed_time}`), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Ksh {payment.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.reference}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.source || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : payment.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

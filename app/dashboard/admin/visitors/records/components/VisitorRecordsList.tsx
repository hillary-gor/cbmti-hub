"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import { Visitor } from "@/types/visitor";
import { format, isValid, parseISO } from "date-fns";
import { checkOutVisitor, deleteVisitor } from "../../actions";
import { useRouter } from "next/navigation";

interface VisitorRecordsListProps {
  initialVisitors: Visitor[];
  currentFilter: "checked_in" | "checked_out" | "all";
  currentStartDate: string;
  currentEndDate: string;
  currentSearchTerm: string;
}

export default function VisitorRecordsList({
  initialVisitors,
  currentFilter,
  currentStartDate,
  currentEndDate,
  currentSearchTerm,
}: VisitorRecordsListProps) {
  const router = useRouter();
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [filter, setFilter] = useState<"checked_in" | "checked_out" | "all">(
    currentFilter,
  );
  const [startDate, setStartDate] = useState<string>(currentStartDate);
  const [endDate, setEndDate] = useState<string>(currentEndDate);
  const [searchTerm, setSearchTerm] = useState<string>(currentSearchTerm);
  const [isPending, startTransition] = useTransition();

  type ActionResponse = {
    status: "success" | "error" | "idle";
    message: string;
  };

  const [actionMessage, setActionMessage] = useState<ActionResponse | null>(
    null,
  );

  useEffect(() => {
    setVisitors(initialVisitors);
    setFilter(currentFilter);
    setStartDate(currentStartDate);
    setEndDate(currentEndDate);
    setSearchTerm(currentSearchTerm);
  }, [
    initialVisitors,
    currentFilter,
    currentStartDate,
    currentEndDate,
    currentSearchTerm,
  ]);

  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const visitorCheckInDate = parseISO(visitor.check_in_time);
      const visitorCheckOutDate = visitor.check_out_time
        ? parseISO(visitor.check_out_time)
        : null;

      const matchesStatus =
        filter === "all" ||
        (filter === "checked_in" && !visitor.check_out_time) ||
        (filter === "checked_out" && visitor.check_out_time);

      const start = startDate ? parseISO(startDate) : null;
      // Adjust end date to include the entire day
      const end = endDate
        ? new Date(parseISO(endDate).setHours(23, 59, 59, 999))
        : null;

      let matchesDateRange = true;

      if (start || end) {
        if (filter === "checked_in") {
          matchesDateRange =
            (!start || (isValid(start) && visitorCheckInDate >= start)) &&
            (!end || (isValid(end) && visitorCheckInDate <= end));
        } else if (filter === "checked_out") {
          if (visitorCheckOutDate) {
            matchesDateRange =
              (!start || (isValid(start) && visitorCheckOutDate >= start)) &&
              (!end || (isValid(end) && visitorCheckOutDate <= end));
          } else {
            matchesDateRange = false;
          }
        } else {
          const relevantDate = visitorCheckOutDate || visitorCheckInDate;
          matchesDateRange =
            (!start || (isValid(start) && relevantDate >= start)) &&
            (!end || (isValid(end) && relevantDate <= end));
        }
      }

      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        visitor.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        visitor.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
        (visitor.email &&
          visitor.email.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (visitor.purpose &&
          visitor.purpose.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (visitor.description &&
          visitor.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (visitor.person_to_visit &&
          visitor.person_to_visit.toLowerCase().includes(lowerCaseSearchTerm));

      return matchesStatus && matchesDateRange && matchesSearch;
    });
  }, [visitors, filter, startDate, endDate, searchTerm]);

  // Removed verbose debug log for filteredVisitors. This can be added back temporarily for debugging.
  // useEffect(() => { /* ... */ }, [...]);

  const updateUrlParams = (
    newFilter: "checked_in" | "checked_out" | "all",
    newStartDate: string,
    newEndDate: string,
    newSearchTerm: string,
  ) => {
    const params = new URLSearchParams();
    if (newFilter !== "checked_in") params.set("status", newFilter);
    if (newStartDate) params.set("startDate", newStartDate);
    if (newEndDate) params.set("endDate", newEndDate);
    if (newSearchTerm) params.set("searchTerm", newSearchTerm);
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (
    newFilter: "checked_in" | "checked_out" | "all",
  ) => {
    setFilter(newFilter);
    updateUrlParams(newFilter, startDate, endDate, searchTerm);
  };

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    updateUrlParams(filter, newStartDate, newEndDate, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    updateUrlParams(filter, startDate, endDate, newSearchTerm);
  };

  const handleResetFilters = () => {
    setFilter("checked_in");
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    updateUrlParams("checked_in", "", "", "");
  };

  const handleCheckOut = async (visitorId: string) => {
    startTransition(async () => {
      setActionMessage(null);
      const response = await checkOutVisitor(visitorId);
      setActionMessage(response);
      if (response.status === "success") {
        setVisitors((prevVisitors) =>
          prevVisitors.map((v) =>
            v.id === visitorId
              ? { ...v, check_out_time: new Date().toISOString() }
              : v,
          ),
        );
      }
    });
  };

  const handleDelete = async (visitorId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this visitor record? This action cannot be undone.",
      )
    ) {
      return;
    }
    startTransition(async () => {
      setActionMessage(null);
      const response = await deleteVisitor(visitorId);
      setActionMessage(response);
      if (response.status === "success") {
        setVisitors((prevVisitors) =>
          prevVisitors.filter((v) => v.id !== visitorId),
        );
      }
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-zinc-700">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex-grow">
            <label
              htmlFor="statusFilter"
              className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
            >
              Filter by Status:
            </label>
            <div className="inline-flex rounded-lg shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-l-lg
                  ${
                    filter === "checked_in"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-zinc-700 dark:text-gray-100 dark:hover:bg-zinc-600"
                  }
                  transition-colors duration-200`}
                onClick={() => handleFilterChange("checked_in")}
              >
                Checked In
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-200 dark:border-zinc-700
                  ${
                    filter === "checked_out"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-zinc-700 dark:text-gray-100 dark:hover:bg-zinc-600"
                  }
                  transition-colors duration-200`}
                onClick={() => handleFilterChange("checked_out")}
              >
                Checked Out
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border border-gray-200 dark:border-zinc-700 rounded-r-lg
                  ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 hover:bg-gray-50 dark:bg-zinc-700 dark:text-gray-100 dark:hover:bg-zinc-600"
                  }
                  transition-colors duration-200`}
                onClick={() => handleFilterChange("all")}
              >
                All
              </button>
            </div>
          </div>

          <div className="flex-grow md:flex-grow-0 md:w-auto">
            <label
              htmlFor="search"
              className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
            >
              Search:
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, phone, email, etc."
              className="w-full md:w-64 shadow-sm border border-gray-300 dark:border-zinc-600 rounded-lg py-2 px-3 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 flex-wrap">
            <div>
              <label
                htmlFor="startDate"
                className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
              >
                From Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => handleDateChange(e.target.value, endDate)}
                className="shadow-sm border border-gray-300 dark:border-zinc-600 rounded-lg py-2 px-3 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out dark:bg-zinc-700"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
              >
                To Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => handleDateChange(startDate, e.target.value)}
                className="shadow-sm border border-gray-300 dark:border-zinc-600 rounded-lg py-2 px-3 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out dark:bg-zinc-700"
              />
            </div>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-100 dark:hover:bg-zinc-600 transition duration-200 text-sm font-medium md:self-end"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {isPending && (
        <div className="text-blue-600 dark:text-blue-400 text-center my-6 flex items-center justify-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.087 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing action...</span>
        </div>
      )}

      {actionMessage && (
        <div
          className={`my-4 p-4 rounded-lg text-center font-medium shadow-md ${
            actionMessage.status === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {actionMessage.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
        {filteredVisitors.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 py-10 text-lg">
            No visitor records found for the selected criteria.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Purpose
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Person to Visit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Check-in Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Check-out Time
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
              {filteredVisitors.map((visitor) => {
                const checkInDate = parseISO(visitor.check_in_time);
                const checkOutDate = visitor.check_out_time
                  ? parseISO(visitor.check_out_time)
                  : null;

                return (
                  <tr
                    key={visitor.id}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {visitor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {visitor.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {visitor.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                      {visitor.purpose || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {visitor.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {visitor.person_to_visit || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {isValid(checkInDate)
                        ? format(checkInDate, "MMM dd, BBBB HH:mm")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {checkOutDate && isValid(checkOutDate) ? (
                        format(checkOutDate, "MMM dd, BBBB HH:mm")
                      ) : (
                        <span className="text-blue-500 font-medium">
                          Checked In
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {!visitor.check_out_time && (
                        <button
                          onClick={() => handleCheckOut(visitor.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-1 border border-blue-600 dark:border-blue-400 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                          disabled={isPending}
                        >
                          Check Out
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(visitor.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-3 py-1 border border-red-600 dark:border-red-400 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        disabled={isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { checkInVisitor, ActionResponse } from "../../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-800 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      disabled={pending}
    >
      {pending ? "Checking In..." : "Check In"}
    </button>
  );
}

const initialState: ActionResponse = {
  status: "idle",
  message: "",
};

export default function VisitorCheckinForm() {
  const [state, formAction] = useActionState(checkInVisitor, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const purposeOptions = [
    "Meeting",
    "Delivery",
    "Interview",
    "General Inquiry",
    "Service/Maintenance",
    "Other",
  ];

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 sm:space-y-6 p-4 sm:p-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
        >
          Full Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="appearance-none border border-gray-300 dark:border-zinc-600 rounded-lg w-full py-2.5 px-3.5 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm"
          placeholder="e.g., John Doe"
          required
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
        >
          Phone Number:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="appearance-none border border-gray-300 dark:border-zinc-600 rounded-lg w-full py-2.5 px-3.5 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm"
          placeholder="e.g., +254712345678"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
        >
          Email (Optional):
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="appearance-none border border-gray-300 dark:border-zinc-600 rounded-lg w-full py-2.5 px-3.5 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm"
          placeholder="e.g., example@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="purpose"
          className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
        >
          Purpose of Visit (Optional):
        </label>
        <select
          id="purpose"
          name="purpose"
          className="appearance-none border border-gray-300 dark:border-zinc-600 rounded-lg w-full py-2.5 px-3.5 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out shadow-sm"
        >
          <option value="">Select a purpose</option>
          {purposeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
        >
          Brief Description (Optional):
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="appearance-none border border-gray-300 dark:border-zinc-600 rounded-lg w-full py-2.5 px-3.5 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm"
          placeholder="e.g., Meeting with [Person's Name] about [Topic]"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="person_to_visit"
          className="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2"
        >
          Person/Department to Visit (Optional):
        </label>
        <input
          type="text"
          id="person_to_visit"
          name="person_to_visit"
          className="appearance-none border border-gray-300 dark:border-zinc-600 rounded-lg w-full py-2.5 px-3.5 text-gray-800 dark:text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out placeholder:text-gray-400 dark:placeholder:text-zinc-500 shadow-sm"
          placeholder="e.g., Admissions Department or Jane Doe"
        />
      </div>

      <SubmitButton />

      {state.status !== "idle" && (
        <div
          className={`mt-4 p-4 rounded-lg text-center font-medium ${
            state.status === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
          }`}
        >
          {state.message}
        </div>
      )}
    </form>
  );
}

// app/dashboard/admin/payments/components/AdminPaymentDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import {
  getStudentsByIntakeAndCourse,
  updatePaymentStatusByAdmin,
  getApprovedPaymentsSumByStudent,
} from "../actions";
import {
  FeePayment,
  PaymentStatus,
  Course,
  Intake,
  StudentWithRelations,
} from "@/types/fee_payment";
import { format } from "date-fns";
import { getPaymentsByStudent } from "../actions";

interface PaymentUpdateFormState {
  status: "success" | "error" | "";
  message: string;
}

const initialPaymentUpdateState: PaymentUpdateFormState = {
  status: "",
  message: "",
};

function PaymentStatusToggleButton({
  paymentId,
  currentStatus,
  onUpdateSuccess,
}: {
  paymentId: string;
  currentStatus: PaymentStatus;
  onUpdateSuccess: () => void;
}) {
  const updatePaymentStatusAction = async (
    prevState: PaymentUpdateFormState,
    formData: FormData,
  ): Promise<PaymentUpdateFormState> => {
    const paymentId = formData.get("paymentId") as string;
    const newStatus = formData.get("newStatus") as PaymentStatus;
    return updatePaymentStatusByAdmin(prevState, { paymentId, newStatus });
  };

  const [formState, formAction] = useActionState(
    updatePaymentStatusAction,
    initialPaymentUpdateState,
  );
  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.status === "success") {
      onUpdateSuccess();
    }
  }, [formState, onUpdateSuccess]);

  return (
    <form action={formAction} className="flex gap-2 items-center">
      <input type="hidden" name="paymentId" value={paymentId} />
      {currentStatus === "pending" && (
        <>
          <button
            type="submit"
            name="newStatus"
            value="approved"
            disabled={pending}
            className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {pending ? "..." : "Approve"}
          </button>
          <button
            type="submit"
            name="newStatus"
            value="declined"
            disabled={pending}
            className="px-3 py-1 bg-red-500 text-white text-xs rounded-full hover:bg-red-600 disabled:opacity-50 transition-colors"
          >
            {pending ? "..." : "Decline"}
          </button>
        </>
      )}
      {currentStatus === "approved" && (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
          Approved
        </span>
      )}
      {currentStatus === "declined" && (
        <>
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold">
            Declined
          </span>
          <button
            type="submit"
            name="newStatus"
            value="approved"
            disabled={pending}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {pending ? "..." : "Re-approve"}
          </button>
        </>
      )}
      {formState.message && (
        <span
          className={`text-xs ml-2 ${
            formState.status === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {formState.message}
        </span>
      )}
    </form>
  );
}

export default function AdminPaymentDashboard({
  initialIntakes,
  initialCourses,
  initialStudents,
}: {
  initialIntakes: Intake[];
  initialCourses: Course[];
  initialStudents: StudentWithRelations[];
}) {
  const [intakes] = useState<Intake[]>(initialIntakes);
  const [courses] = useState<Course[]>(initialCourses);
  const [selectedIntake, setSelectedIntake] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [students, setStudents] =
    useState<StudentWithRelations[]>(initialStudents);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithRelations | null>(null);
  const [studentPayments, setStudentPayments] = useState<FeePayment[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingAllPayments, setIsLoadingAllPayments] = useState(false);
  const [approvedPaymentsSum, setApprovedPaymentsSum] = useState<number>(0);
  const [isLoadingApprovedSum, setIsLoadingApprovedSum] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      setIsLoadingStudents(true);
      const fetchedStudents = await getStudentsByIntakeAndCourse(
        selectedIntake,
        selectedCourse,
      );
      setStudents(fetchedStudents);
      setIsLoadingStudents(false);
      setSelectedStudent(null);
      setStudentPayments([]);
      setApprovedPaymentsSum(0);
    }
    fetchStudents();
  }, [selectedIntake, selectedCourse]);

  const handleStudentSelect = async (student: StudentWithRelations) => {
    setSelectedStudent(student);
    setIsLoadingAllPayments(true);
    setIsLoadingApprovedSum(true);
    try {
      const fetchedPayments = await getPaymentsByStudent(student.id);
      setStudentPayments(fetchedPayments);

      const sum = await getApprovedPaymentsSumByStudent(student.id);
      setApprovedPaymentsSum(sum);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setStudentPayments([]);
      setApprovedPaymentsSum(0);
    } finally {
      setIsLoadingAllPayments(false);
      setIsLoadingApprovedSum(false);
    }
  };

  const handlePaymentUpdateSuccess = async () => {
    if (!selectedStudent) return;

    setIsLoadingAllPayments(true);
    setIsLoadingApprovedSum(true);
    try {
      const refreshedPayments = await getPaymentsByStudent(selectedStudent.id);
      setStudentPayments(refreshedPayments);

      const refreshedSum = await getApprovedPaymentsSumByStudent(
        selectedStudent.id,
      );
      setApprovedPaymentsSum(refreshedSum);
    } catch (error) {
      console.error("Error refreshing student payments:", error);
    } finally {
      setIsLoadingAllPayments(false);
      setIsLoadingApprovedSum(false);
    }
  };

  const handlePrint = (printType: "student" | "intake" | "course") => {
    let contentToPrint = "";
    let printTitle = "Payment Records";

    if (printType === "student") {
      if (!selectedStudent) {
        console.error("Please select a student to print their records.");
        return;
      }
      if (isLoadingAllPayments || isLoadingApprovedSum) {
        console.error(
          "Payments data is still loading. Please wait and try again.",
        );
        return;
      }
      if (studentPayments.length === 0 && approvedPaymentsSum === 0) {
        console.error(
          "No payment data available for the selected student to print.",
        );
        return;
      }

      const printAreaElement = document.getElementById("print-area");
      if (printAreaElement) {
        contentToPrint = printAreaElement.innerHTML;
      } else {
        console.error("Could not find the print area for student payments.");
        return;
      }
      printTitle = `Payments for ${selectedStudent.full_name} (${selectedStudent.reg_number})`;
    } else {
      const printAreaElement = document.getElementById("print-area");
      if (printAreaElement) {
        contentToPrint = printAreaElement.innerHTML;
      }

      if (!contentToPrint) {
        console.error(
          "No content to print for the selected filter. Apply filters first.",
        );
        return;
      }

      if (printType === "intake" && selectedIntake) {
        const intakeLabel =
          intakes.find((i) => i.id === selectedIntake)?.label ||
          "Selected Intake";
        printTitle = `Payments for Intake: ${intakeLabel}`;
      } else if (printType === "course" && selectedCourse) {
        const courseInfo = courses.find((c) => c.id === selectedCourse);
        const courseTitle = courseInfo
          ? `${courseInfo.title} (${courseInfo.code})`
          : "Selected Course";
        printTitle = `Payments for Course: ${courseTitle}`;
      }
    }

    if (!contentToPrint) {
      console.error("Could not generate content for printing.");
      return;
    }

    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write(`<html><head><title>${printTitle}</title>`);
      printWindow.document.write(
        '<script src="https://cdn.tailwindcss.com"></script>',
      );
      printWindow.document.write("<style>");
      printWindow.document.write(`
          @media print {
            body { font-family: 'Inter', sans-serif; margin: 20px; }
            h1, h2, h3 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .no-print { display: none; }
          }
        `);
      printWindow.document.write("</style>");
      printWindow.document.write("</head><body>");
      printWindow.document.write(`<h1>${printTitle}</h1>`);
      printWindow.document.write(contentToPrint);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Could not open print window. Please allow pop-ups.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Admin Payment Dashboard
      </h1>

      <div className="no-print mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Filter Students
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="intake-select"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Select Intake:
            </label>
            <select
              id="intake-select"
              value={selectedIntake}
              onChange={(e) => setSelectedIntake(e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Intakes</option>
              {intakes.map((intake) => (
                <option key={intake.id} value={intake.id}>
                  {intake.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="course-select"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Select Course:
            </label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Students</h2>
          {isLoadingStudents ? (
            <p className="py-8 text-center text-gray-500">
              Loading students...
            </p>
          ) : students.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No students found for the selected filters.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {students.map((student) => (
                  <li
                    key={student.id}
                    className={`cursor-pointer p-4 hover:bg-gray-50 ${
                      selectedStudent?.id === student.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleStudentSelect(student)}
                  >
                    <p className="font-medium text-gray-900">
                      {student.full_name} ({student.reg_number})
                    </p>
                    <p className="text-sm text-gray-600">
                      {student.course?.title} ({student.course?.code}) -{" "}
                      {student.intake?.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Payment Details for Selected Student
          </h2>
          {selectedStudent ? (
            <div id="print-area">
              <h3 className="mb-4 text-lg font-bold text-gray-800">
                {selectedStudent.full_name} ({selectedStudent.reg_number})
              </h3>
              {isLoadingApprovedSum ? (
                <p className="text-gray-500 text-center text-sm mb-4">
                  Loading total approved payments...
                </p>
              ) : (
                <p className="text-gray-800 text-lg font-semibold mb-4">
                  Total Approved Payments:{" "}
                  <span className="text-green-600">
                    Ksh {approvedPaymentsSum.toFixed(2)}
                  </span>
                </p>
              )}
              {isLoadingAllPayments ? (
                <p className="py-8 text-center text-gray-500">
                  Loading payments...
                </p>
              ) : studentPayments.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  No payments submitted by this student.
                </p>
              ) : (
                <div className="overflow-x-auto" id="payments-table-container">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Ref
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Source
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Msg
                        </th>
                        <th className="no-print px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                          Status/Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {studentPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className={
                            payment.status === "approved" ? "bg-green-50" : ""
                          }
                        >
                          <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-800">
                            {payment.recorded_at
                              ? format(
                                  new Date(payment.recorded_at),
                                  "MMM dd,yyyy HH:mm",
                                )
                              : "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
                            Ksh {payment.amount?.toFixed(2) ?? "0.00"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
                            {payment.reference || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
                            {payment.source || "N/A"}
                          </td>
                          <td className="max-w-xs overflow-hidden text-ellipsis px-4 py-2 text-sm text-gray-600">
                            <details>
                              <summary className="cursor-pointer text-blue-600 hover:underline">
                                View Message
                              </summary>
                              <p className="mt-2 whitespace-normal break-words text-xs">
                                {payment.message_text || "No message provided."}
                              </p>
                            </details>
                          </td>
                          <td className="no-print whitespace-nowrap px-4 py-2 text-sm">
                            <PaymentStatusToggleButton
                              paymentId={payment.id}
                              currentStatus={payment.status}
                              onUpdateSuccess={handlePaymentUpdateSuccess}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {studentPayments.length > 0 && (
                <div className="no-print mt-6 flex flex-wrap gap-4">
                  <button
                    onClick={() => handlePrint("student")}
                    disabled={
                      isLoadingAllPayments ||
                      studentPayments.length === 0 ||
                      isLoadingApprovedSum
                    }
                    className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 4V2a2 2 0 012-2h6a2 2 0 012 2v2h2a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h2zm0 10v2h10v-2H5zm11-10H3a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1zm-1 3a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Print Selected Student Records
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              Select a student from the left to view payments.
            </p>
          )}

          {(selectedIntake || selectedCourse) && (
            <div className="no-print mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => handlePrint("intake")}
                className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-indigo-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-4V3a1 1 0 10-2 0v1H9zm1 11a1 1 0 10-2 0v2H7a1 1 0 100 2h6a1 1 0 100-2h-1v-2a1 1 0 10-2 0z" />
                </svg>
                Print Intake/Course Records
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// app/lecturer/attendance/[sessionId]/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

import { SessionWithCourseAndIntake } from "@/types/attendance";

import { generateQrCode, startAttendance, endAttendance } from "../actions";

const QR_REFRESH_INTERVAL_MS = 30 * 1000;

export default function LecturerQRPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const supabase = createClient();

  const [currentQrValue, setCurrentQrValue] = useState<string | null>(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [sessionDetails, setSessionDetails] =
    useState<SessionWithCourseAndIntake | null>(null);
  const [qrCountdown, setQrCountdown] = useState(QR_REFRESH_INTERVAL_MS / 1000);
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const qrTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSessionAndAttendance = useCallback(async () => {
    setIsLoading(true);
    console.log("Attempting to fetch session with ID:", sessionId);

    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select(
        `*,
        course_intakes(
          id,
          courses(
            id, title, code, lecturer_id
          ),
          intakes(
            id, label
          )
        )
      `,
      )
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      console.error(
        "Session fetch failed. Details:",
        sessionError?.message || "No session data received",
        sessionError?.details,
        sessionError?.hint,
        sessionError?.code,
      );
      toast.error("Could not load session details.");
      setIsLoading(false);
      return;
    }

    console.log("Session fetched successfully:", session);
    setSessionDetails(session);

    const courseIdForStudents = session.course_intakes?.courses?.id;
    if (courseIdForStudents) {
      const { count, error: countError } = await supabase
        .from("students")
        .select("id", { count: "exact" })
        .eq("course_id", courseIdForStudents);

      if (!countError && count !== null) {
        setTotalStudents(count);
      } else {
        console.warn(
          "Could not fetch total student count:",
          countError?.message || "Unknown error",
        );
        setTotalStudents(0);
      }
    } else {
      console.warn(
        "Could not determine course_id for total student count (missing course_intakes data).",
      );
      setTotalStudents(0);
    }

    const { count: currentCount, error: attendanceCountError } = await supabase
      .from("attendance")
      .select("id", { count: "exact" })
      .eq("session_id", sessionId)
      .eq("status", "present");

    if (!attendanceCountError && currentCount !== null) {
      setAttendanceCount(currentCount);
    } else {
      console.warn(
        "Could not fetch current attendance count:",
        attendanceCountError?.message || "Unknown error",
      );
      setAttendanceCount(0);
    }

    if (session.is_attendance_active) {
      setCurrentQrValue(session.last_qr_code_value);
      setIsAttendanceActive(true);
      const lastGenerated = new Date(
        session.last_qr_code_generated_at || new Date(),
      );
      const timeElapsed =
        (new Date().getTime() - lastGenerated.getTime()) / 1000;
      setQrCountdown(
        Math.max(0, QR_REFRESH_INTERVAL_MS / 1000 - Math.floor(timeElapsed)),
      );
    } else {
      setIsAttendanceActive(false);
      setCurrentQrValue(null);
      setQrCountdown(QR_REFRESH_INTERVAL_MS / 1000);
    }
    setIsLoading(false);
  }, [sessionId, supabase]);

  const handleGenerateNewQrCode = useCallback(async () => {
    toast.loading("Updating QR Code...", { id: "qr-update-toast" });
    const result = await generateQrCode(sessionId);

    if (result.success) {
      setCurrentQrValue(result.newQrValue || null);
      setQrCountdown(QR_REFRESH_INTERVAL_MS / 1000);
      toast.success("QR Code updated!", { id: "qr-update-toast" });
    } else {
      toast.error(`Failed to update QR: ${result.error}`, {
        id: "qr-update-toast",
      });
      console.error("Error from generateQrCode Server Action:", result.error);
    }
  }, [sessionId]);

  const handleStartAttendance = async () => {
    toast.loading("Starting attendance...", { id: "start-attendance-toast" });
    const result = await startAttendance(sessionId);

    if (result.success) {
      setIsAttendanceActive(true);
      toast.success("Attendance started!", { id: "start-attendance-toast" });
    } else {
      toast.error(`Error starting attendance: ${result.error}`, {
        id: "start-attendance-toast",
      });
      console.error("Error starting attendance:", result.error);
    }
  };

  const handleEndAttendance = async () => {
    if (qrTimerRef.current) {
      clearInterval(qrTimerRef.current);
      qrTimerRef.current = null;
    }
    setCurrentQrValue(null);
    setQrCountdown(QR_REFRESH_INTERVAL_MS / 1000);

    toast.loading("Ending attendance...", { id: "end-attendance-toast" });
    const result = await endAttendance(sessionId);

    if (result.success) {
      setIsAttendanceActive(false);
      toast.success("Attendance ended.", { id: "end-attendance-toast" });
    } else {
      toast.error(`Error ending attendance: ${result.error}`, {
        id: "end-attendance-toast",
      });
      console.error("Error ending attendance:", result.error);
    }
  };

  useEffect(() => {
    fetchSessionAndAttendance();

    const attendanceChannel = supabase
      .channel(`attendance:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `session_id=eq.${sessionId}`,
        },
        async (payload) => {
          console.log("Realtime attendance change detected:", payload);
          const { count, error } = await supabase
            .from("attendance")
            .select("id", { count: "exact" })
            .eq("session_id", sessionId)
            .eq("status", "present");

          if (!error && count !== null) {
            setAttendanceCount(count);
          } else {
            console.warn(
              "Realtime fetch failed to update attendance count:",
              error?.message || "Unknown error",
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(attendanceChannel);
    };
  }, [sessionId, supabase, fetchSessionAndAttendance]);

  // FIX: Defer the execution of handleGenerateNewQrCode to prevent hydration errors
  useEffect(() => {
    if (isAttendanceActive && !currentQrValue) {
      console.log(
        "Attendance active and no QR value. Triggering initial QR generation.",
      );
      const timer = setTimeout(() => {
        handleGenerateNewQrCode();
      }, 0); // Defer to the end of the current event loop

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [isAttendanceActive, currentQrValue, handleGenerateNewQrCode]);

  useEffect(() => {
    if (isAttendanceActive) {
      if (qrTimerRef.current) {
        clearInterval(qrTimerRef.current);
      }

      qrTimerRef.current = setInterval(() => {
        setQrCountdown((prev) => {
          if (prev <= 1) {
            handleGenerateNewQrCode();
            return QR_REFRESH_INTERVAL_MS / 1000;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (qrTimerRef.current) {
        clearInterval(qrTimerRef.current);
        qrTimerRef.current = null;
      }
    }

    return () => {
      if (qrTimerRef.current) {
        clearInterval(qrTimerRef.current);
      }
    };
  }, [isAttendanceActive, handleGenerateNewQrCode]);

  if (isLoading || !sessionDetails) {
    return (
      <div className="text-center text-gray-600 p-8">
        Loading session details...
      </div>
    );
  }

  const course_title = sessionDetails.course_intakes?.courses?.title || "N/A";
  const course_code = sessionDetails.course_intakes?.courses?.code || "N/A";
  const intake_label = sessionDetails.course_intakes?.intakes?.label || "N/A";

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h2 className="text-2xl font-semibold mb-2">
        Attendance for {course_title} ({course_code})
      </h2>
      <p className="text-gray-600 mb-4">
        Intake: {intake_label} | Date:{" "}
        {new Date(sessionDetails.session_date).toLocaleDateString("en-KE")} |
        Time: {sessionDetails.start_time.substring(0, 5)} -{" "}
        {sessionDetails.end_time.substring(0, 5)}
      </p>

      {!isAttendanceActive ? (
        <Button
          onClick={handleStartAttendance}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors duration-200"
        >
          Start Attendance for Session
        </Button>
      ) : (
        <>
          <div className="mb-6 p-4 border rounded-lg bg-yellow-50 flex flex-col md:flex-row items-center justify-between shadow-sm">
            <p className="font-medium text-yellow-800 text-center md:text-left mb-2 md:mb-0">
              Attendance is ACTIVE. QR code refreshes in:{" "}
              <span className="font-bold" aria-live="polite">
                {qrCountdown}
              </span>{" "}
              seconds
            </p>
            <Button
              onClick={handleEndAttendance}
              className="bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors duration-200 w-full md:w-auto"
            >
              End Attendance
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="flex-1 text-center bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-xl font-medium mb-4 text-gray-800">
                Scan this QR Code
              </h3>
              {currentQrValue ? (
                <QRCodeDisplay qrValue={currentQrValue} size={300} />
              ) : (
                <p className="text-gray-500">Generating QR code...</p>
              )}
            </div>
            <div className="flex-1 text-center bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200">
              <h3 className="text-xl font-medium mb-4 text-gray-800">
                Current Attendance
              </h3>
              <p className="text-5xl font-bold text-blue-600">
                {attendanceCount} / {totalStudents || "?"}
              </p>
              <p className="text-gray-500 mt-2">
                Students Marked Present (Real-time)
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

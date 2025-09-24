"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { verifyGraduate } from "./actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function GraduateVerification() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    if (!input.trim()) return;
    startTransition(async () => {
      const data = await verifyGraduate(input.trim());
      setResult(data || null);
      setOpen(true);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      {/*Logo at the top */}
      <Image
        src="/codeblue-logo.png"
        alt="Institution Logo"
        width={120}
        height={120}
        priority
        className="mb-6"
      />

      <h1 className="text-3xl font-semibold mb-6 text-center">
        Graduate Verification
      </h1>

      <div className="w-full max-w-md flex flex-col gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Certificate / Transcript / Reg Number"
          className="rounded-md border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleSearch}
          disabled={isPending || !input.trim()}
          className="w-full py-3"
        >
          {isPending ? "Searching..." : "Find"}
        </Button>
      </div>

      {/* Result Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Result</DialogTitle>
            <DialogDescription>
              {result ? "Graduate record found:" : "No matching record found."}
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {result.full_name}
              </p>
              <p>
                <strong>Course:</strong> {result.course}
              </p>
              <p>
                <strong>Graduation Date:</strong> {result.graduation_date}
              </p>
              {result.grade_class && (
                <p>
                  <strong>Grade:</strong> {result.grade_class}
                </p>
              )}
              {result.certificate_no && (
                <p>
                  <strong>Certificate No:</strong> {result.certificate_no}
                </p>
              )}
              {result.transcript_no && (
                <p>
                  <strong>Transcript No:</strong> {result.transcript_no}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

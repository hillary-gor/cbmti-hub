"use client";

import React, { useState } from "react";
import { read, utils, writeFileXLSX } from "xlsx";
import { Button } from "@/components/ui/button";
import { uploadGraduates, GraduateRow } from "./actions";

export default function GraduateUploadPage() {
  const [rows, setRows] = useState<GraduateRow[]>([]);
  const [uploading, setUploading] = useState(false);

  /** Parse the chosen file into JSON rows */
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = read(evt.target?.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = utils.sheet_to_json<GraduateRow>(ws, { defval: "" });
      setRows(json);
    };
    reader.readAsBinaryString(file);
  }

  /** Send rows to Supabase */
  async function handleUpload() {
    if (!rows.length) return alert("No rows to upload.");
    setUploading(true);
    try {
      await uploadGraduates(rows);
      alert("Upload complete!");
      setRows([]);
    } catch (err) {
      alert(`❌ ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  }

  /** Generate & download Excel template with all DB columns */
  function downloadTemplate() {
    const headers = [
      [
        "full_name",
        "reg_number",
        "certificate_no",
        "transcript_no",
        "course",
        "graduation_date",
        "grade_class",
        "email",
        "phone_number",
        "notes",
      ],
    ];
    const ws = utils.aoa_to_sheet(headers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Template");
    writeFileXLSX(wb, "graduate_upload_template.xlsx");
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Graduate Document Upload
        </h1>

        {/* File input + template download */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFile}
            className="block w-full md:w-auto text-sm text-gray-700
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          <Button variant="secondary" onClick={downloadTemplate}>
            Download Excel Template
          </Button>
        </div>

        {rows.length > 0 && (
          <>
            <div className="overflow-x-auto mb-6 border rounded-lg">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    {Object.keys(rows[0]).map((key) => (
                      <th key={key} className="px-3 py-2 capitalize">
                        {key.replaceAll("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                      {Object.keys(r).map((key) => (
                        <td key={key} className="px-3 py-2">
                          {(r as any)[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center">
              <Button
                disabled={uploading}
                onClick={handleUpload}
                className="px-6 py-2"
              >
                {uploading ? "Uploading..." : "Upload to Supabase"}
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

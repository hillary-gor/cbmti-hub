'use client';

import Image from 'next/image';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useRef } from 'react';

type Props = {
  name: string;
  regNo: string;
  course: string;
  effectiveDate: string;
  dueDate: string;
  photoUrl: string;
};

const StudentTagCard = ({
  name,
  regNo,
  course,
  effectiveDate,
  dueDate,
  photoUrl,
}: Props) => {
  const tagRef = useRef<HTMLDivElement>(null);

  const downloadAsImage = async () => {
    if (!tagRef.current) return;
    const canvas = await html2canvas(tagRef.current);
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${name.replaceAll(' ', '_')}_tag.png`;
    link.click();
  };

  const downloadAsPDF = async () => {
    if (!tagRef.current) return;
    const canvas = await html2canvas(tagRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1050, 600],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 1050, 600);
    pdf.save(`${name.replaceAll(' ', '_')}_tag.pdf`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-10 px-4 flex flex-col items-center justify-center overflow-hidden">
      {/* Tag Card */}
      <div className="w-full flex justify-center overflow-hidden">
        <div
          id="student-tag"
          ref={tagRef}
          className="w-[1050px] h-[600px] rounded-xl shadow-lg border overflow-hidden flex flex-col scale-[0.35] origin-top sm:scale-100 sm:origin-center"
          style={{ backgroundColor: '#ffffff', color: '#111827' }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-8 py-4"
            style={{
              background: 'linear-gradient(to right, #1e3a8a, #7e22ce, #db2777)',
              color: '#ffffff',
            }}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/codeblue-logo.png"
                alt="School Logo"
                width={70}
                height={70}
              />
              <span className="text-3xl font-bold">CODE BLUE MEDICAL</span>
            </div>
            <div className="text-5xl font-medium">
              Reg No: <span className="font-bold">{regNo}</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 p-8 gap-10 items-start">
            <div className="relative w-[350px] h-[350px] rounded-full overflow-hidden shadow-md border-4 border-white">
              <Image
                src={photoUrl || '/fallback-avatar.png'}
                alt={`${name}'s photo`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col justify-center text-lg gap-4">
              <h2 className="text-5xl font-bold" style={{ color: '#1e3a8a' }}>
                {name}
              </h2>
              <p>
                <strong className="text-5xl" style={{ color: '#dc2626' }}>
                  Course:
                </strong>{' '}
                <span className="text-4xl font-semibold">{course}</span>
              </p>

              <div className="flex flex-col gap-4">
                <div
                  className="text-5xl inline-block px-4 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: '#e9d5ff',
                    color: '#6b21a8',
                  }}
                >
                  Effective Date: {effectiveDate}
                </div>
                <div
                  className="text-5xl inline-block px-4 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: '#fecaca',
                    color: '#b91c1c',
                  }}
                >
                  Due Date: {dueDate}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex text-4xl justify-between items-center px-8 py-2 border-t"
            style={{ color: '#6b7280' }}
          >
            <span>www.codebluemedical.co.ke</span>
            <span>+254 7 510 918 42</span>
          </div>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <button
          onClick={downloadAsPDF}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold py-2 px-4 rounded"
        >
          Download as PDF
        </button>
        <button
          onClick={downloadAsImage}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold py-2 px-4 rounded"
        >
          Download as PNG
        </button>
      </div>
    </div>
  );
};

export default StudentTagCard;

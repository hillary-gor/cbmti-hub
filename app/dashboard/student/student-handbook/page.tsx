"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Menu, Search } from "lucide-react";

export default function StudentHandbookDocs() {
  const sections = useMemo(
    () => [
      {
        id: "welcome",
        title: "Welcome & Mission",
        text:
          "Welcome to our learning community. This handbook outlines expectations, policies, and resources to help you succeed.",
        content: (
          <>
            <p className="mt-2 text-base leading-relaxed">
              Welcome to our learning community. This handbook outlines
              expectations, policies, and resources to help you succeed.
            </p>
          </>
        ),
      },
      {
        id: "code-of-conduct",
        title: "Code of Conduct",
        text:
          "Professional behaviour, respect for peers and staff, and academic honesty are required. Respect others time and space. No plagiarism. Follow assessment rules and deadlines.",
        content: (
          <>
            <p className="mt-2 text-base leading-relaxed">
              Professional behaviour, respect for peers and staff, and academic
              honesty are required.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Respect others&apos; time and space.</li>
              <li>No plagiarism — always cite sources.</li>
              <li>Follow assessment rules and deadlines.</li>
            </ul>
          </>
        ),
      },
      {
        id: "attendance",
        title: "Attendance & Punctuality",
        text:
          "Regular attendance is essential. Notify your cohort lead if absent. Two late entries equal one absence. Excessive absences can affect graduation eligibility.",
        content: (
          <>
            <p className="mt-2 text-base leading-relaxed">
              Regular attendance is essential. Notify your cohort lead ahead of
              time if you will be absent.
            </p>
            <p className="mt-2 font-medium">Late policy</p>
            <p className="mt-1 text-sm leading-snug">
              Two late entries = one absence. Excessive absences can affect
              graduation eligibility.
            </p>
          </>
        ),
      },
      {
        id: "fees",
        title: "Fees & Payment",
        text:
          "All fees should be paid according to the schedule. Visit the finance office for receipts and queries.",
        content: (
          <>
            <p className="mt-2 text-base leading-relaxed">
              All fees should be paid according to the schedule. See the finance
              office for receipts and queries.
            </p>
          </>
        ),
      },
      {
        id: "graduation",
        title: "Graduation Requirements",
        text:
          "Complete required coursework, practical assessments, and clear any financial holds.",
        content: (
          <>
            <p className="mt-2 text-base leading-relaxed">
              Complete required coursework, practical assessments, and clear any
              financial holds.
            </p>
          </>
        ),
      },
    ],
    []
  );

  // Scrollspy state
  const [activeId, setActiveId] = useState(sections[0].id);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: "-10% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    els.forEach((el) => observer.observe(el!));
    return () => observer.disconnect();
  }, [sections]);

  // Search / filter
  const [query, setQuery] = useState("");
  const filtered = sections.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) || s.text.toLowerCase().includes(q)
    );
  });

  // smooth scroll helper
  function goTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.location.hash = id; // update hash for accessibility
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="Open navigation menu"
              >
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-lg font-semibold">Student Handbook</h1>
                <p className="text-sm text-gray-500">
                  Policies, expectations and resources — quick access for
                  students
                </p>
              </div>
            </div>

            <div className="flex-1 max-w-lg md:max-w-xs">
              <label className="relative block">
                <span className="sr-only">Search handbook</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search handbook..."
                  className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={16} />
                </span>
              </label>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button className="px-3 py-1 rounded-md text-sm border">
                Download PDF
              </button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">
                Request Clarification
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar / TOC */}
        <aside className="hidden md:block sticky top-24 self-start">
          <div className="w-60 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="mb-3">
              <h3 className="text-sm font-semibold">On this page</h3>
            </div>
            <nav className="space-y-1 text-sm" aria-label="Handbook sections">
              {filtered.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(s.id);
                  }}
                  className={`block cursor-pointer rounded-md px-2 py-1 hover:bg-gray-50 transition-colors ${
                    activeId === s.id
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {s.title}
                </a>
              ))}
            </nav>

            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-gray-500">
                Last updated:{" "}
                <span className="text-gray-700 font-medium">Sept 2025</span>
              </p>
            </div>
          </div>
        </aside>

        {/* Content area */}
        <section ref={containerRef} className="prose max-w-none lg:prose-lg">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <article>
              {filtered.map((section) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="mb-10"
                >
                  <h2
                    className="text-2xl font-semibold"
                    id={`${section.id}-heading`}
                  >
                    {section.title}
                  </h2>
                  <div className="mt-3 text-sm text-gray-700">
                    {section.content}
                  </div>
                </motion.section>
              ))}

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-md border text-sm"
                >
                  Print
                </button>

                <button
                  onClick={() =>
                    alert("Feature: Request clarification — open form modal")
                  }
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm"
                >
                  Request Clarification
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Code Blue Medical Training Institute —
          Student Handbook
        </div>
      </footer>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center py-24 px-6 gap-4 bg-gradient-to-b from-white to-gray-100 dark:from-[#0a0a0a] dark:to-gray-900"
      >
        <h1 className="text-4xl sm:text-5xl font-bold max-w-2xl leading-tight">
          Empowering Healthcare Students Across Kenya
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Register, learn, and thrive through our seamless digital student
          portal.
        </p>
        <div className="mt-6">
          <Button size="lg">Get Started</Button>
        </div>
      </motion.section>

      {/* Features Overview */}
      <section id="features" className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12">Everything You Need</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
            {[
              "Digital Timetables",
              "E-learning Modules",
              "Online Exams",
              "Automated Certificates",
              "Clinical Placement",
              "Secure Login",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-muted rounded-xl p-6 shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="bg-gray-100 dark:bg-gray-800 py-20 px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">What Students Say</h2>
          <blockquote className="italic mb-4">
            “Code Blue made it easy to pay fees and follow up on classes.” –
            Mary, Nairobi
          </blockquote>
          <blockquote className="italic">
            “No stress. Just login and see everything in one place.” – James,
            Kisumu
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-6 border-t">
        &copy; {new Date().getFullYear()} Code Blue Medical Training Institute.
        All rights reserved.
      </footer>
    </div>
  );
}

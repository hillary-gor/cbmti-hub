"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-background py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
        {/* === Left: Text Content === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-foreground text-balance">
            Empowering Healthcare Students Across Kenya
          </h1>

          <p className="text-muted-foreground text-lg max-w-prose">
            Register, learn, and thrive through our seamless digital student
            portal.
          </p>

          <Link href="/signup">
            <Button
              size="lg"
              className="bg-[#329EE8] text-white hover:bg-[#2b8ed3] transition"
            >
              Get Started
            </Button>
          </Link>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 pt-6 text-sm text-foreground font-medium">
            <li>📅 Digital Timetables</li>
            <li>📘 E-learning Modules</li>
            <li>📝 Online Exams</li>
            <li>📄 Automated Certificates</li>
            <li>🏥 Clinical Placement</li>
            <li>🔐 Secure Login</li>
          </ul>
        </motion.div>

        {/* === Right: Hero Image === */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative w-full h-full"
        >
          <Image
            src="https://gowiaewbjsdsvihqmsyg.supabase.co/storage/v1/object/public/assets//truphosa-baker-eddie-etisi.svg"
            alt="Baker and Eddie from Code Blue Medical"
            width={800}
            height={800}
            className="w-full h-auto object-cover rounded-xl shadow-lg"
            priority
            placeholder="blur"
            blurDataURL="/blur/truphosa-blur.png"
          />
        </motion.div>
      </div>
    </section>
  );
}

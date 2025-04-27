"use client";

import { motion } from "framer-motion";

export function WelcomeCard({ name }: { name: string }) {
  return (
    <motion.div
      className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold">Welcome, {name}</h1>
      <p className="text-muted-foreground">
        This is your personalized dashboard
      </p>
    </motion.div>
  );
}

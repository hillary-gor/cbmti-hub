"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes intelligently.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a readable format (e.g., "April 28, 2025").
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

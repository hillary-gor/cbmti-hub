"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes intelligently.
 * 
 * - Accepts multiple class names conditionally.
 * - Merges conflicting Tailwind classes smartly.
 * 
 * @param inputs One or multiple class names, possibly conditional
 * @returns A single merged string of classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

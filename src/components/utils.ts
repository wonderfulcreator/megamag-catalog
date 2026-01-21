import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function humanSize(size?: string | null) {
  if (!size) return "";
  return size.replaceAll("x", "×");
}

export function slugToTitle(slug: string) {
  return slug.replaceAll("-", " ");
}

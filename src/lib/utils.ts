import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(inputString: string | null) {
  if (inputString) {
    const date = new Date(inputString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  return "";
}

export function formatDateTime(inputDateString: string | null) {
  if (inputDateString) {
    const d = new Date(inputDateString);
    const f = (n: number) => n.toString().padStart(2, '0');
    return `${f(d.getUTCDate())}/${f(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} - ${f(d.getUTCHours())}:${f(d.getUTCMinutes())}:${f(d.getUTCSeconds())}`;
  }
  return "";
}
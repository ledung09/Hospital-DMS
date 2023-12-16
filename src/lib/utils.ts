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
    
    // Add 7 hours to the date
    d.setUTCHours(d.getUTCHours() + 7);

    const f = (n: number) => n.toString().padStart(2, '0');
    return `${f(d.getUTCDate())}/${f(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} - ${f(d.getUTCHours())}:${f(d.getUTCMinutes())}:${f(d.getUTCSeconds())}`;
  }
  return "";
}


export function addHoursToDateTime(dateTimeString: string | null) {
  if (dateTimeString) {
    const originalDate = new Date(dateTimeString);
    originalDate.setHours(originalDate.getHours() + 7);
    const formattedDate = originalDate.toISOString().replace('T', ' ').slice(0, 19);
    return formattedDate;
  }
  return ""
}

export function combineCodeAndConcat(arr: {code: string, concat: string}[]) {
  if (arr.length === 0) {
    return [];
  }
  return arr.map(obj => ({
    label: `${obj.code} - ${obj.concat}`,
    value: obj.code
  }));
}

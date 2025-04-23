import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", options);
};

export const formatNumber = (num: number) => {
  if (num >= 10) {
    return `Views: ${num}`;
  }
  return `View: ${num}`;
};

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}

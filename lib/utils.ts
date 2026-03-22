import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatIndianCurrency = (num: number) => {
  if (num == null) return "₹0";
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return `₹${Number(num).toLocaleString('en-IN')}`;
};

export const formatIndianNumber = (num: number) => {
  if (num == null) return "0";
  if (num >= 10000000) return `${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  return Number(num).toLocaleString('en-IN');
};

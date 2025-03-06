import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  // Always include the protocol and host 
  if (typeof window !== 'undefined') {
    // Browser should use current host
    return window.location.origin;
  }
  
  // Server-side: use environment variables
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Fallback to localhost in development
  return `http://localhost:${process.env.PORT || 3000}`;
}


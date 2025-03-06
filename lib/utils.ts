import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  
  // Get the custom domain or Vercel URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                 (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
                 
  // Fallback to localhost if no domain is set
  if (!baseUrl && process.env.NODE_ENV === 'production') {
    throw new Error('Please set NEXT_PUBLIC_BASE_URL in production');
  }
  
  return baseUrl || `http://localhost:${process.env.PORT || 3000}`;
}


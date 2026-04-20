export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side: use the current window location
    return window.location.origin;
  }

  // Server-side: prefer BETTER_AUTH_URL or NEXT_PUBLIC_APP_URL, fallback to Vercel URL
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Default to localhost for local development
  return "http://localhost:3000";
}

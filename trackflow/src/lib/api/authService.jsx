/**
 * @file lib/api/authService.js (or a similar path)
 * @description This file contains server-side functions for handling session and authentication logic.
 */

import { cookies } from "next/headers";
import fetcher from "./api-helpers";


/**
 * Retrieves the current user's session data by reading the server-side `auth-token` cookie.
 *
 * This is a server-only function that can be used in Server Components, Route Handlers,
 * or other server-side data-fetching functions in Next.js. It performs the following steps:
 * 1.  Reads the 'auth-token' from the incoming request's cookies.
 * 2.  If the token exists, it makes an authenticated request to the `/api/auth/me` endpoint.
 * 3.  It gracefully handles errors, specifically identifying 401 Unauthorized errors
 *     to flag the token as expired.
 *
 * @async
 * @returns {Promise<{user: object | null, authToken?: string, isTokenExpired: boolean}>}
 *          A promise that resolves to an object containing the session state.
 *          - On success: `{ user: {...}, authToken: "...", isTokenExpired: false }`
 *          - On auth failure (e.g., expired token): `{ user: null, isTokenExpired: true }`
 *          - On no token: `{ user: null, isTokenExpired: false }`
 */
export async function getUserSession() {
  const cookieStore = cookies();
  const authToken = await cookieStore.get("auth-token")?.value;

  if (!authToken) {
    return { user: null, isTokenExpired: false };
  }

  try {
    const user = await fetcher("/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
      cache: "no-store",
    });

    return { user, authToken, isTokenExpired: false };
  } catch (error) {
    const isTokenExpired = error?.status === 401;

    return {
      user: null,
      isTokenExpired,
    };
  }
}

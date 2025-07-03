import { cookies } from 'next/headers';

/**
 * @file API service for server-side session management.
 */
export async function getUserSession() {
  console.log("[FRONTEND-SERVER] 3. getUserSession called on a server page (e.g., during layout render or page load).");
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  if (!authToken) {
    console.error("[FRONTEND-SERVER] 3a. 'auth-token' cookie NOT FOUND.");
    return { user: null, token: null };
  }
  
  console.log(`[FRONTEND-SERVER] 3b. 'auth-token' cookie FOUND. Value (first 15 chars): [${authToken.substring(0, 15)}...]`);

  const backendApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const url = `${backendApiUrl}/api/auth/me`;
  console.log(`[FRONTEND-SERVER] 4. Fetching user from backend at: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
      cache: 'no-store'
    });
    
    console.log(`[FRONTEND-SERVER] 4a. Backend response status for /api/auth/me: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[FRONTEND-SERVER] 4b. Backend returned an error: ${errorText}`);
      return { user: null, token: null };
    }
    
    const user = await response.json();
    console.log("[FRONTEND-SERVER] 5. Successfully fetched user from backend. Session is valid.");
    return { user, token: authToken };
  
  } catch (error) {
    console.error("[FRONTEND-SERVER] 4c. CRITICAL: fetch to backend FAILED completely (network error or protocol mismatch).", error);
    return { user: null, token: null };
  }
}
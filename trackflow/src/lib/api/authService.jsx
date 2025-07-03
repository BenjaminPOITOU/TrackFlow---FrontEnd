import { cookies } from 'next/headers';

/**
 * @file API service for server-side session management.
 */

/**
 * Retrieves the current user session by validating the auth token from cookies.
 * This function MUST only be called from Server Components, Route Handlers, or Server Actions.
 *
 * @returns {Promise<{user: object|null}>} A promise that resolves with the user object if the session is valid, otherwise null.
 */
export async function getUserSession() {
  const cookieStore = await cookies();
 
  

 

  const backendApiUrl = process.env.SPRING_BOOT_API_URL;

  try {
    const authToken = cookieStore.get('auth-token')?.value;
    if (!authToken) {
      return { user: null };
    }

    const response = await fetch(`${backendApiUrl}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      cache: 'no-store'
    });



    if (!response.ok) {
      return { user: null };
    }
    
    const user = await response.json();
  
    return { user, authToken };
  
  } catch (error) {
    console.error("authServer: Failed to fetch user session.", error);
    return { user: null };
  }
}
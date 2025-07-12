/**
 * @file app/api/auth/logout/route.js (or .ts)
 * @description API route handler for user logout.
 * This endpoint securely invalidates the user's session by deleting the 'auth-token' cookie.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';



/**
 * Handles the POST request to log out a user.
 *
 * This function clears the authentication session by setting the 'auth-token' cookie
 * to an empty value and expiring it immediately (maxAge: 0). It uses secure
 * cookie attributes (httpOnly, sameSite) to prevent common web vulnerabilities.
 *
 * @async
 * @method POST
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 * On success, it returns a JSON object { success: true } with a 200 status code.
 * On failure, it returns a JSON object { error: 'Logout failed' } with a 500 status code.
 */

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    cookieStore.set('auth-token', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
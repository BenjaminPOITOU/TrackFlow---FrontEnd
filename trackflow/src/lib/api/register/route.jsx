import { NextResponse } from 'next/server';

/**
 * Handles user login requests by proxying them to the backend authentication service.
 * Upon successful authentication, it receives a JWT from the backend and sets it
 * in a secure, httpOnly cookie to establish a session for the user.
 * 
 * @param {Request} request The incoming HTTP request object containing user credentials.
 * @returns {Promise<NextResponse>} A promise that resolves to the response, which includes
 *                                   a session cookie on success or an error message on failure.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const backendBody = {
      login: email,
      password: password,
    };
    
    const backendResponse = await fetch(`${process.env.SPRING_BOOT_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendBody),
    });

    const responseData = await backendResponse.json();
    
    if (!backendResponse.ok) {
        return NextResponse.json(responseData, { status: backendResponse.status });
    }

    const { accessToken } = responseData;
    const response = NextResponse.json({ message: 'Login successful' });
    
    response.cookies.set({
      name: 'session_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error) {
    console.error('[API_LOGIN_ERROR]', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
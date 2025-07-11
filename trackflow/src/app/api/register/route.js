import { NextResponse } from 'next/server';

const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Handles new user registration requests by proxying them to the backend service.
 * It expects a POST request with a JSON body containing all required user details
 * and forwards this data to the backend's registration endpoint.
 *
 * @param {Request} request The incoming request object from the client.
 * @returns {Promise<NextResponse>} A response object. On success, it returns the
 * success message from the backend. On failure, it forwards the error message
 * and status code from the backend.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    const targetUrl = `${backendApiUrl}/api/auth/register`;

    const backendResponse = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(responseData, { status: backendResponse.status });
    }

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

/**
 * Handles user login requests by proxying them to the backend authentication service.
 * Upon successful authentication, it receives a JWT from the backend and sets it
 * in a secure, httpOnly cookie to establish a session for the user.
 * This version includes detailed logging for debugging purposes.
 * 
 * @param {Request} request The incoming HTTP request object containing user credentials.
 * @returns {Promise<NextResponse>} A promise that resolves to the response, which includes
 *                                   a session cookie on success or an error message on failure.
 */
export async function POST(request) {
  console.log("✅ [API Route /login] - Point d'entrée atteint.");
  
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log("✅ [API Route /login] - Corps de la requête parsé:", { email, password: '********' });

    const backendUrl = process.env.SPRING_BOOT_API_URL;
    console.log(`✅ [API Route /login] - URL du backend lue depuis .env: ${backendUrl}`);

    if (!backendUrl) {
      throw new Error("La variable d'environnement SPRING_BOOT_API_URL n'est pas définie. Le serveur Next.js doit être redémarré après sa création.");
    }

    const backendBody = {
      login: email,
      password: password,
    };
    
    const targetUrl = `${backendUrl}/api/auth/login`;
    console.log(`➡️ [API Route /login] - Tentative de requête POST vers: ${targetUrl}`);
    console.log(`➡️ [API Route /login] - Avec le corps (body): ${JSON.stringify({ login: backendBody.login, password: '********' })}`);

    const backendResponse = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backendBody),
    });

    console.log(`⬅️ [API Route /login] - Réponse reçue du backend avec le statut: ${backendResponse.status}`);

    const responseData = await backendResponse.json();
    
    if (!backendResponse.ok) {
        console.error("❌ [API Route /login] - Le backend a renvoyé une erreur:", responseData);
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
      maxAge: 60 * 60 * 24, // 24 heures
    });

    console.log("✅ [API Route /login] - Succès. Envoi de la réponse au client avec le cookie.");
    return response;

  } catch (error) {
    console.error("❌ [API Route /login] - ERREUR CRITIQUE DANS LE BLOC TRY/CATCH:", error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
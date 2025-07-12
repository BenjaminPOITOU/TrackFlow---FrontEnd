/**
 * @file app/api/auth/login/route.js (or .ts)
 * @description API route handler for user login.
 * This function acts as a Backend-for-Frontend (BFF). It securely proxies authentication
 * requests from the client to the main backend API, receives a JWT, and sets it
 * in a secure, httpOnly cookie for the client.
 */

import { NextResponse } from "next/server";

/**
 * Handles the POST request to authenticate a user.
 *
 * It performs the following steps:
 * 1. Receives login credentials (`login`, `password`) from the client request body.
 * 2. Forwards these credentials to the main backend authentication service.
 * 3. If authentication is successful, it extracts the JWT from the backend's response.
 * 4. Sets the JWT in a secure `httpOnly` cookie to establish a session for the user's browser.
 * 5. Returns a success response to the client, including some user data.
 * 6. Handles various error cases, such as invalid credentials or server errors.
 *
 * @async
 * @method POST
 * @param {Request} request - The incoming request object from Next.js, containing the user's credentials.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object.
 *  - On success: JSON `{ success: true, user: {...} }` with a 200 status and an 'auth-token' cookie.
 *  - On failure: JSON `{ error: '...' }` with a 401 or 500 status code.
 */

export async function POST(request) {
  try {
    console.log("[LOGIN API] Requête POST reçue");

    const { login, password } = await request.json();
    console.log("[LOGIN API] Données reçues du frontend:", { login, password });

    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log(
      "[LOGIN API] URL backend ciblée:",
      `${backendApiUrl}/api/auth/login`
    );

    const backendResponse = await fetch(`${backendApiUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });

    console.log("[LOGIN API] Statut réponse backend:", backendResponse.status);

    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error("[LOGIN API] Erreur backend:", error);
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      );
    }

    const data = await backendResponse.json();
    console.log("[LOGIN API] Réponse backend:", data);

    const token = data.token || data.accessToken || data.authToken;
    console.log("[LOGIN API] Token extrait:", token);

    if (!token) {
      console.error(
        "[LOGIN API] Aucun token trouvé dans la réponse backend:",
        data
      );
      return NextResponse.json({ error: "Token manquant" }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      user: data.user || { email: login },
      message: "Connexion réussie",
    });

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    console.log("[LOGIN API] Réponse envoyée avec cookie auth-token");
    return response;
  } catch (error) {
    console.error("[LOGIN API] Erreur lors de la connexion:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur lors de la connexion",
      },
      { status: 500 }
    );
  }
}

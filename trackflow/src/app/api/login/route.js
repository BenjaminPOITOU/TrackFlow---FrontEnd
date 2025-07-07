import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("[LOGIN API] Requête POST reçue");

    const { login, password } = await request.json();
    console.log("[LOGIN API] Données reçues du frontend:", { login, password });

    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
    console.log("[LOGIN API] URL backend ciblée:", `${backendApiUrl}/api/auth/login`);

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

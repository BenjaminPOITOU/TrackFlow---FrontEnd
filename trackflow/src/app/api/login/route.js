
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log("[LOGIN API] Réception de la requête de connexion");
    
    const { login, password } = await request.json();
    console.log("[LOGIN API] Tentative de connexion pour:", login);
    

    const backendApiUrl = process.env.SPRING_BOOT_API_URL;
    const backendResponse = await fetch(`${backendApiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });
    
    console.log("[LOGIN API] Réponse backend status:", backendResponse.status);
    
    if (!backendResponse.ok) {
      const error = await backendResponse.text();
      console.error("[LOGIN API] Erreur backend:", error);
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }
    
    const data = await backendResponse.json();
    console.log("[LOGIN API] Données reçues du backend:", Object.keys(data));
    

    const token = data.token || data.accessToken || data.authToken;
    
    if (!token) {
      console.error("[LOGIN API] Aucun token trouvé dans la réponse backend:", data);
      return NextResponse.json({ error: 'Token manquant' }, { status: 500 });
    }
    
    console.log("[LOGIN API] Token reçu (15 premiers chars):", token.substring(0, 15) + '...');
    


    console.log("[LOGIN API] Cookie 'auth-token' créé avec succès");

    const response = NextResponse.json({
      success: true,
      user: data.user || { email: login },
      message: 'Connexion réussie'
    });
  
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/'
    });
    return response;
    
  } catch (error) {
    console.error("[LOGIN API] Erreur lors de la connexion:", error);
    return NextResponse.json({ 
      error: 'Erreur serveur lors de la connexion' 
    }, { status: 500 });
  }
}
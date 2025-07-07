import { cookies } from 'next/headers';
import fetcher from './api-helpers';

export async function getUserSession() {
  console.log('🔍 [getUserSession] Début de la fonction');
  
  const cookieStore = await cookies();
  console.log('🍪 [getUserSession] CookieStore récupéré');
  
  const authToken = cookieStore.get('auth-token')?.value;
  console.log('🔑 [getUserSession] Token récupéré:', authToken ? 'TOKEN_PRÉSENT' : 'TOKEN_ABSENT');
  
  if (authToken) {
    console.log('🔑 [getUserSession] Token (premiers 50 caractères):', authToken.substring(0, 50) + '...');
    
 
    try {
      const payload = JSON.parse(atob(authToken.split('.')[1]));
      console.log('📋 [getUserSession] Payload JWT:', {
        sub: payload.sub,
        iat: new Date(payload.iat * 1000).toISOString(),
        exp: new Date(payload.exp * 1000).toISOString(),
        isExpired: payload.exp * 1000 < Date.now()
      });
    } catch (jwtError) {
      console.error('❌ [getUserSession] Erreur décodage JWT:', jwtError);
    }
  }

  if (!authToken) {
    console.log('⚠️ [getUserSession] Pas de token, retour user null');
    return { user: null, isTokenExpired: false };
  }

  const endpoint = '/api/auth/me';
  console.log('🌐 [getUserSession] Endpoint appelé:', endpoint);
  
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    cache: 'no-store'
  };
  
  console.log('📤 [getUserSession] Options de requête:', {
    method: fetchOptions.method,
    headers: { ...fetchOptions.headers, Authorization: 'Bearer [TOKEN_MASQUÉ]' },
    cache: fetchOptions.cache
  });

  try {
    console.log('🚀 [getUserSession] Appel à fetcher...');
    const user = await fetcher(endpoint, fetchOptions);
    console.log('✅ [getUserSession] Réponse fetcher reçue:', user ? 'USER_RÉCUPÉRÉ' : 'USER_NULL');
    
    if (user) {
      console.log('👤 [getUserSession] Données utilisateur:', {
        id: user.id,
        email: user.email
      });
    }

    console.log('🎉 [getUserSession] Retour succès avec user');
    return { user, authToken, isTokenExpired: false };
    
  } catch (error) {
    console.error('❌ [getUserSession] Erreur dans fetcher:', error);
    console.error('❌ [getUserSession] Type erreur:', typeof error);
    console.error('❌ [getUserSession] Message erreur:', error.message);
    console.error('❌ [getUserSession] Status erreur:', error.status);
    console.error('❌ [getUserSession] Stack trace:', error.stack);
    
    const isTokenExpired = error.status === 401 ||
      error.message?.includes('401') ||
      error.message?.includes('Unauthorized') ||
      error.message?.includes('jwt expired') ||
      error.message?.includes('invalid token') ||
      error.message?.includes('Token expired');
    
    console.log('⏰ [getUserSession] Token expiré?', isTokenExpired);
    console.log('🔚 [getUserSession] Retour avec erreur - user null, isTokenExpired:', isTokenExpired);
    
    return { user: null, isTokenExpired };
  }
}
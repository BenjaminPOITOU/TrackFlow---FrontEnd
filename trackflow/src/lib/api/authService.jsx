import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fetcher from './api-helpers';

export async function getUserSession() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token')?.value;
  
  if (!authToken) {
    return { user: null, isTokenExpired: false };
  }

  try {
    const user = await fetcher('/api/auth/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
      cache: 'no-store'
    });

    return { user, authToken, isTokenExpired: false };
    
  } catch (error) {
    const isTokenExpired = error.status === 401 || 
      error.message?.includes('401') ||
      error.message?.includes('Unauthorized');
    
    if (isTokenExpired) {
      redirect('/');
    }
    
    return { user: null, isTokenExpired };
  }
}
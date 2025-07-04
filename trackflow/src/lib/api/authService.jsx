import { cookies } from 'next/headers';
import fetcher from './api-helpers';

export async function getUserSession() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  if (!authToken) {
    return { user: null, isTokenExpired: false };
  }

  const endpoint = '/api/auth/me';
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    cache: 'no-store'
  };

  try {
    const user = await fetcher(endpoint, fetchOptions);

    return { user, authToken, isTokenExpired: false };
  } catch (error) {
    const isTokenExpired = error.status === 401 ||
      error.message?.includes('401') ||
      error.message?.includes('Unauthorized') ||
      error.message?.includes('jwt expired') ||
      error.message?.includes('invalid token') ||
      error.message?.includes('Token expired');
    return { user: null, isTokenExpired };
  }
}

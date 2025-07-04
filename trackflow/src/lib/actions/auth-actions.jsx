'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server Action pour nettoyer le cookie d'authentification
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
}

/**
 * Server Action pour logout complet (nettoie le cookie et redirige)
 */
export async function logoutAction() {
  await clearAuthCookie();
  redirect('/login');
}
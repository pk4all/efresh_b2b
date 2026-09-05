import { B2BUser } from '@/types';

export function setAuthSession(token: string, user?: B2BUser | null) {
  // Store cookie for Next.js middleware / proxy.ts
  document.cookie = `auth-token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;

  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    if (user) {
      localStorage.setItem('b2b_user', JSON.stringify(user));
    }
  }
}

export function clearAuthSession() {
  document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('b2b_user');
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function getStoredUser(): B2BUser | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('b2b_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
}

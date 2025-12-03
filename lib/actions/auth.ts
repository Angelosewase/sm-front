'use server';

import { redirect } from 'next/navigation';

// Note: These functions are deprecated as we've moved to localStorage-based auth.
// Server actions cannot access localStorage, so these return null.
// The axiosInstance interceptor handles adding Authorization headers automatically.

export async function setAuthCookie(token: string) {
  // Deprecated: Token is now stored in localStorage on the client
  console.warn('setAuthCookie is deprecated. Token storage is handled client-side.');
}

export async function setUserCookie(user: any) {
  // Deprecated: User is now stored in localStorage on the client
  console.warn('setUserCookie is deprecated. User storage is handled client-side.');
}

export async function getAuthToken() {
  // Deprecated: Server actions cannot access localStorage.
  // The axiosInstance interceptor automatically adds the Authorization header
  // from localStorage, so manual token retrieval is not needed.
  return null;
}

export async function getUser() {
  // Deprecated: Server actions cannot access localStorage.
  // Use the useAuth hook in client components instead.
  return null;
}

export async function clearAuthCookies() {
  // Deprecated: Cookies are cleared client-side via localStorage
  console.warn('clearAuthCookies is deprecated. Auth clearing is handled client-side.');
}

export async function logout() {
  // Deprecated: Logout is handled client-side via AuthContext
  redirect('/login');
}

export async function setSchoolCookie(school: any) {
  // Deprecated: School is now stored in localStorage on the client
  console.warn('setSchoolCookie is deprecated. School storage is handled client-side.');
}

export async function getSchoolCookie() {
  // Deprecated: Server actions cannot access localStorage.
  // Use the useSchool hook in client components instead.
  return null;
}
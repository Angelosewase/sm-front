'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('accessToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function setUserCookie(user: any) {
  const cookieStore = await cookies();
  
  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: false, // Accessible on client for display
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
}

export async function getUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  return userCookie ? JSON.parse(userCookie) : null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  cookieStore.delete('accessToken');
  cookieStore.delete('user');
  cookieStore.delete('school');
}

export async function logout() {
  await clearAuthCookies();
  redirect('/login');
}


export async function setSchoolCookie(school: any) {
  const cookieStore = await cookies();
  
  cookieStore.set('school', JSON.stringify(school), {
    httpOnly: false, // Accessible on client for display
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}


export async function getSchoolCookie(school: any) {
  const cookieStore = await cookies();
  
  cookieStore.set('school', JSON.stringify(school), {
    httpOnly: false, // Accessible on client for display
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { setCookie, getCookie, deleteCookie } from 'cookies-next/server';

export async function setAuthCookie(token: string) {
  await setCookie('accessToken', token, {
    cookies,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function setUserCookie(user: any) {
  await setCookie('user', JSON.stringify(user), {
    cookies,
    httpOnly: false, // Accessible on client for display
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getAuthToken() {
  return await getCookie('accessToken', { cookies });
}

export async function getUser() {
  const userCookie = await getCookie('user', { cookies });
  return userCookie ? JSON.parse(userCookie as string) : null;
}

export async function clearAuthCookies() {
  await deleteCookie('accessToken', { cookies });
  await deleteCookie('user', { cookies });
  await deleteCookie('school', { cookies });
}

export async function logout() {
  await clearAuthCookies();
  redirect('/login');
}


export async function setSchoolCookie(school: any) {
  await setCookie('school', JSON.stringify(school), {
    cookies,
    httpOnly: false, // Accessible on client for display
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function getSchoolCookie() {
  const schoolCookie = await getCookie('school', { cookies });
  return schoolCookie ? JSON.parse(schoolCookie as string) : null;
}
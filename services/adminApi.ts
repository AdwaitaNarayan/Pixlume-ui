/**
 * Admin API helpers — auth, upload, delete.
 */

import axios from 'axios';
import { Photo } from './api';

const isProduction = process.env.NODE_ENV === 'production';
const BASE = isProduction
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

// ── Token storage ────────────────────────────────────────────────────────────
export function saveToken(token: string) {
  if (typeof window !== 'undefined') localStorage.setItem('pixlume_admin_token', token);
}
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('pixlume_admin_token');
}
export function removeToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('pixlume_admin_token');
}
export function isLoggedIn(): boolean {
  return !!getToken();
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function adminLogin(email: string, password: string): Promise<string> {
  // FastAPI OAuth2PasswordRequestForm expects form-urlencoded
  // Auth router is mounted at /admin prefix → endpoint is /admin/login
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);

  const { data } = await axios.post<{ access_token: string; token_type: string }>(
    `${BASE}/admin/login`,
    form.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return data.access_token;
}

export async function getAdminMe(token: string) {
  const { data } = await axios.get(`${BASE}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// ── Photos ────────────────────────────────────────────────────────────────────
export async function adminUploadPhoto(
  token: string,
  payload: { title: string; caption?: string; tags?: string; file: File }
): Promise<Photo> {
  const form = new FormData();
  form.append('title', payload.title);
  if (payload.caption) form.append('caption', payload.caption);
  if (payload.tags) form.append('tags', payload.tags);
  form.append('file', payload.file);

  const { data } = await axios.post<Photo>(`${BASE}/admin/upload`, form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function adminDeletePhoto(token: string, photoId: string): Promise<void> {
  await axios.delete(`${BASE}/admin/photo/${photoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminGetPhotos(page = 1, pageSize = 20) {
  const { data } = await axios.get(`${BASE}/photos/`, {
    params: { page, page_size: pageSize },
  });
  return data;
}

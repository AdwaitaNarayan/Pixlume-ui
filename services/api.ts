/**
 * Pixlume – Axios API client
 *
 * Base URL is read from the environment variable NEXT_PUBLIC_API_URL.
 * Default: http://localhost:8000
 *
 * Backend contract
 * ----------------
 * GET  /photos                    → PhotoListResponse
 * GET  /photos/:id                → PhotoRead
 * GET  /search?tag=<tag>          → PhotoListResponse
 * POST /admin/upload  (protected) → PhotoRead
 */

import axios from 'axios';

// ---------------------------------------------------------------------------
// Types (mirrors the Pydantic schemas returned by the FastAPI backend)
// ---------------------------------------------------------------------------
export interface Photo {
  id: string;
  categories: string[];
  caption: string | null;
  tags: string[] | null;
  thumbnail_url: string | null;
  image_720_url: string | null;
  image_1080_url: string | null;
  image_2k_url: string | null;
  image_4k_url: string | null;
  created_at: string; // ISO-8601
  downloads: number;
}

export interface PhotoListResponse {
  total: number;
  page: number;
  page_size: number;
  results: Photo[];
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
// In production, use the relative /api path so requests are proxied
// server-side by Next.js rewrites — this avoids Mixed Content errors
// because the browser only ever talks to the same HTTPS origin.
// In local dev, fall back to the direct backend URL.
const isProduction = process.env.NODE_ENV === 'production';
const baseURL = isProduction
  ? '/api'
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30_000, // 30 s
});

// ---------------------------------------------------------------------------
// Public gallery functions
// ---------------------------------------------------------------------------

/**
 * Fetch all photos (paginated, newest first).
 */
export async function getPhotos(
  page = 1,
  pageSize = 20
): Promise<PhotoListResponse> {
  const { data } = await axiosClient.get<PhotoListResponse>('/photos/', {
    params: { page, page_size: pageSize },
  });
  return data;
}

/**
 * Fetch a single photo by its UUID.
 */
export async function getPhotoById(id: string): Promise<Photo> {
  const { data } = await axiosClient.get<Photo>(`/photos/${id}`);
  return data;
}

/**
 * Search photos by tag.
 * Uses GET /search?tag=<tag> – maps to the backend tag-search endpoint.
 */
export async function searchPhotos(
  tag: string,
  page = 1,
  pageSize = 20,
  filters?: {
    resolution?: string;
    date?: string;
    category?: string;
    collection?: string;
  }
): Promise<PhotoListResponse> {
  const { data } = await axiosClient.get<PhotoListResponse>('/photos/search', {
    params: { tag, page, page_size: pageSize, ...filters },
  });
  return data;
}

/**
 * Fetch all unique categories from the database.
 */
export async function getCategories(): Promise<string[]> {
  const { data } = await axiosClient.get<string[]>('/photos/categories');
  return data;
}

// ---------------------------------------------------------------------------
// Compatibility export used by existing gallery components
// ---------------------------------------------------------------------------
export const galleryService = {
  getPhotos,
  getPhotoById,
  searchPhotos,
  getCategories,
};

export default axiosClient;

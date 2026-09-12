import { env } from '../config/env.js';
import { ApiError } from '../utils/errorHandler.js';

// Thin fetch wrapper. Every real service below routes through this so
// auth headers, base URL, and error shaping stay in one place.
//
// FIX: the backend always replies with { success, data } (or
// { success: false, message }) - this used to return res.json() as-is,
// which meant every caller would have received the wrapper object
// instead of the actual payload. Now it unwraps `data` here, once,
// so every service function below can just work with real values.
export async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok || !payload?.success) {
    throw new ApiError(payload?.message || `Request failed (${res.status})`, res.status);
  }

  return payload.data;
}

// Reads the JWT straight from localStorage so every service call can be a
// plain no-arg (or single-arg) function, matching the signatures the hooks
// already call - no need to thread `token` through every hook/component.
export function getToken() {
  return localStorage.getItem('lifeRpgToken');
}

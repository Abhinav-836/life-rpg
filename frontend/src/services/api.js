import { env } from '../config/env.js';
import { ApiError } from '../utils/errorHandler.js';

// The browser's timezone, sent with every request so the server can tell
// when the player's day starts and ends (streaks reset at local midnight).
function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

// Thin fetch wrapper. Every service routes through this so auth headers,
// base URL and error shaping stay in one place. The API always replies
// with { success, data } or { success: false, message, details }; this
// returns `data` directly and turns failures into an ApiError.
export async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Timezone': browserTimeZone(),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok || !payload?.success) {
    // Validation errors come back as a list in `details`; show the first
    // one, since it's more useful than the generic "Validation failed".
    const detail = Array.isArray(payload?.details) && payload.details.length ? payload.details[0] : null;
    throw new ApiError(detail || payload?.message || `Request failed (${res.status})`, res.status);
  }

  return payload.data;
}

// Reads the JWT from localStorage so service functions don't need the
// token threaded through every hook and component.
export function getToken() {
  return localStorage.getItem('lifeRpgToken');
}
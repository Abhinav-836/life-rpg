import { request } from './api.js';

const TOKEN_KEY = 'lifeRpgToken';
const USER_KEY = 'lifeRpgUser';

function persist(user, token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function login({ email, password }) {
  const data = await request('/auth/login', { method: 'POST', body: { email, password } });
  persist(data.user, data.token);
  return data;
}

export async function signup({ name, email, password }) {
  const data = await request('/auth/signup', { method: 'POST', body: { name, email, password } });
  persist(data.user, data.token);
  return data;
}

export async function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { ok: true };
}

// FIX: the mock version of this always returned null on refresh (there was
// no persistence at all), which meant reloading the page always bounced
// back to the login screen even after a real login. Now it restores the
// session from localStorage AND verifies the token is still valid against
// the real backend (via /users/me) rather than trusting a stale token
// blindly - if the token's expired/invalid, this clears it and the
// ProtectedRoute below will correctly send the user back to /login.
export async function getSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);
  if (!token || !storedUser) return null;

  try {
    const user = await request('/users/me', { token });
    return { token, user };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

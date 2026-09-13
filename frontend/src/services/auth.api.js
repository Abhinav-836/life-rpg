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

// NEW: calls the real backend's find-or-create guest endpoint, instead of
// the old approach of calling login() with hardcoded credentials that
// never existed in the real database.
export async function guestLogin() {
  const data = await request('/auth/guest', { method: 'POST' });
  persist(data.user, data.token);
  return data;
}

export async function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { ok: true };
}

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
import { request, getToken } from './api.js';

export async function getProfile() {
  return request('/users/me', { token: getToken() });
}

// FIX: the backend previously had no way to update a profile at all -
// this now calls the new PATCH /users/me endpoint (added alongside this
// fix). Keeps the same client-side validation as before as a fast-fail,
// but the backend re-validates too (never trust client-side checks alone).
export async function updateProfile(data) {
  if (data.name !== undefined && !data.name.trim()) throw new Error('Name cannot be empty.');
  if (data.email !== undefined && !/^\S+@\S+\.\S+$/.test(data.email)) throw new Error('Enter a valid email address.');

  const user = await request('/users/me', {
    method: 'PATCH',
    token: getToken(),
    body: { name: data.name, email: data.email },
  });

  // Keep the cached session user (read by useAuth/getSession) in sync so
  // a page refresh doesn't show the old name.
  const stored = JSON.parse(localStorage.getItem('lifeRpgUser') || '{}');
  localStorage.setItem('lifeRpgUser', JSON.stringify({ ...stored, ...user }));

  return user;
}

// FIX: also previously had nowhere to go - now calls the new
// POST /users/me/password endpoint, which verifies currentPassword
// server-side before allowing the change.
export async function changePassword({ currentPassword, newPassword }) {
  if (!currentPassword) throw new Error('Enter your current password.');
  if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters.');

  return request('/users/me/password', {
    method: 'POST',
    token: getToken(),
    body: { currentPassword, newPassword },
  });
}

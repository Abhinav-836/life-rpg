import { request, getToken } from './api.js';

export async function getProfile() {
  return request('/users/me', { token: getToken() });
}

// Quick client-side checks for instant feedback; the API validates again.
export async function updateProfile(data) {
  if (data.name !== undefined && data.name.trim().length < 2) throw new Error('Name must be at least 2 characters.');
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

// The API verifies the current password before changing it.
export async function changePassword({ currentPassword, newPassword }) {
  if (!currentPassword) throw new Error('Enter your current password.');
  if (!newPassword || newPassword.length < 8) throw new Error('New password must be at least 8 characters.');

  return request('/users/me/password', {
    method: 'POST',
    token: getToken(),
    body: { currentPassword, newPassword },
  });
}

// Permanently deletes the account and all its progress. Demo accounts
// don't need a password.
export async function deleteAccount(password) {
  return request('/users/me', { method: 'DELETE', token: getToken(), body: { password } });
}
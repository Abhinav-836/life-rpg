import { request, getToken } from './api.js';

// Preferences are stored on the server, so they follow the player to any
// device they log in on.
export async function getSettings() {
  return request('/users/me/settings', { token: getToken() });
}

export async function updateSettings(partial) {
  return request('/users/me/settings', { method: 'PATCH', token: getToken(), body: partial });
}
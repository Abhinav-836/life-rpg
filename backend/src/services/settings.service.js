const prisma = require('../config/database');
const { isValidTimeZone } = require('../utils/time');

const THEMES = ['dark-fantasy'];

const DEFAULT_SETTINGS = {
  theme: 'dark-fantasy',
  soundEnabled: true,
  notifications: { streakWarning: true },
};

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Stored settings are merged over the defaults, so adding a new setting
// later never breaks existing users.
function mergeSettings(stored) {
  const s = isPlainObject(stored) ? stored : {};
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(isPlainObject(s.notifications) ? s.notifications : {}) },
  };
}

// Only known keys with the right types are accepted. Anything else is
// reported back instead of being silently written into the JSON column.
function validateSettingsPatch(body) {
  const errors = [];
  if (!isPlainObject(body)) return ['settings must be an object'];

  const allowed = new Set(['theme', 'soundEnabled', 'notifications', 'timezone']);
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) errors.push(`unknown setting: ${key}`);
  }

  if (body.theme !== undefined && !THEMES.includes(body.theme)) {
    errors.push(`theme must be one of: ${THEMES.join(', ')}`);
  }
  if (body.soundEnabled !== undefined && typeof body.soundEnabled !== 'boolean') {
    errors.push('soundEnabled must be true or false');
  }
  if (body.timezone !== undefined && !isValidTimeZone(body.timezone)) {
    errors.push('timezone must be a valid IANA timezone, e.g. Asia/Kolkata');
  }

  for (const group of ['notifications']) {
    if (body[group] === undefined) continue;
    if (!isPlainObject(body[group])) {
      errors.push(`${group} must be an object`);
      continue;
    }
    for (const [key, value] of Object.entries(body[group])) {
      if (!(key in DEFAULT_SETTINGS[group])) errors.push(`unknown ${group} setting: ${key}`);
      else if (typeof value !== 'boolean') errors.push(`${group}.${key} must be true or false`);
    }
  }

  return errors;
}

async function getSettings(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true, timezone: true },
  });
  return { ...mergeSettings(user?.settings), timezone: user?.timezone || 'UTC' };
}

async function updateSettings(userId, patch) {
  const { timezone, ...rest } = patch;
  const current = await getSettings(userId);
  const { timezone: _tz, ...currentSettings } = current;

  const next = mergeSettings({
    ...currentSettings,
    ...rest,
    notifications: { ...currentSettings.notifications, ...(rest.notifications || {}) },
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: { settings: next, ...(timezone ? { timezone } : {}) },
    select: { timezone: true },
  });

  return { ...next, timezone: user.timezone };
}

module.exports = { DEFAULT_SETTINGS, mergeSettings, validateSettingsPatch, getSettings, updateSettings };
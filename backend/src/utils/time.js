// Calendar-day helpers that respect the user's timezone.
//
// A streak "day" has to end at the user's local midnight. Using UTC days
// meant a player in India (UTC+5:30) who finished a quest at 1 AM and
// another at 11 PM the same local day could get two streak days, while
// one at 11 PM and the next at 6 AM the following morning could count as
// the same day.

function isValidTimeZone(tz) {
  if (!tz || typeof tz !== 'string' || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// "YYYY-MM-DD" for the given instant in the given timezone.
function localDateKey(date, timeZone = 'UTC') {
  const tz = isValidTimeZone(timeZone) ? timeZone : 'UTC';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Whole calendar days from a to b, both read in the user's timezone.
function calendarDaysBetween(a, b, timeZone = 'UTC') {
  const toDayNumber = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y, m - 1, d) / 86400000;
  };
  return toDayNumber(localDateKey(b, timeZone)) - toDayNumber(localDateKey(a, timeZone));
}

module.exports = { isValidTimeZone, localDateKey, calendarDaysBetween };
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  useMocks: (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true',
};

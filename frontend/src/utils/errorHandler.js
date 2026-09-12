export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message;
  if (error?.message) return error.message;
  return 'Something went wrong. Please try again.';
}

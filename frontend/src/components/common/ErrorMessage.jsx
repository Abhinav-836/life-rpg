export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
      <span aria-hidden="true">⚠</span>
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="mt-2 underline underline-offset-2 hover:text-ink">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

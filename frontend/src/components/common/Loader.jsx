export default function Loader({ label = 'Loading…', size = 'md' }) {
  const px = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div className="flex items-center gap-3 text-ink-muted" role="status" aria-live="polite">
      <span className={`${px} rounded-full border-2 border-purple/30 border-t-purple animate-spin`} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

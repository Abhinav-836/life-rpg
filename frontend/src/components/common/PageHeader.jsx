export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {eyebrow && <p className="text-sm text-purple font-medium mb-1 drop-shadow-sm">{eyebrow}</p>}
        <h1 className="text-2xl sm:text-3xl font-display text-white drop-shadow-md">{title}</h1>
        {description && <p className="text-gray-200 mt-1.5 max-w-xl text-sm drop-shadow-sm">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}

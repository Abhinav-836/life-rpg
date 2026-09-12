import { createContext, useCallback, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

const KIND_STYLES = {
  success: 'border-ok/40 text-ok',
  error: 'border-danger/40 text-danger',
  info: 'border-purple/40 text-ink',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, kind = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-72" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`card-raised border px-4 py-3 text-sm animate-pop ${KIND_STYLES[t.kind]}`}>
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider.');
  return ctx;
}

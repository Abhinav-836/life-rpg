/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080B18',
        surface: '#11152A',
        'surface-2': '#181D36',
        'surface-3': '#1F2542',
        border: '#262C4E',
        purple: { DEFAULT: '#8B5CF6', dim: '#6D48C9' },
        indigo: { DEFAULT: '#6366F1', dim: '#4A4DC4' },
        gold: { DEFAULT: '#F4C95D', dim: '#C9A23F', bright: '#FFE08A' },
        ink: { DEFAULT: '#F8FAFC', muted: '#A7B0C5', faint: '#6B7390' },
        ok: '#4ADE80',
        danger: '#F87171',
      },
      fontFamily: {
        display: ['"Cinzel"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.25), 0 8px 30px -10px rgba(139,92,246,0.35)',
        goldglow: '0 0 0 1px rgba(244,201,93,0.25), 0 8px 30px -10px rgba(244,201,93,0.35)',
      },
      keyframes: {
        'fill-bar': { from: { width: '0%' }, to: { width: 'var(--fill,0%)' } },
        'pop': { '0%': { transform: 'scale(0.9)', opacity: 0 }, '60%': { transform: 'scale(1.03)', opacity: 1 }, '100%': { transform: 'scale(1)' } },
        'float-up': { '0%': { transform: 'translateY(0)', opacity: 1 }, '100%': { transform: 'translateY(-28px)', opacity: 0 } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fill-bar': 'fill-bar 0.9s cubic-bezier(.2,.8,.2,1) forwards',
        'pop': 'pop 0.35s cubic-bezier(.2,.8,.2,1)',
        'float-up': 'float-up 1s ease-out forwards',
        'shimmer': 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}

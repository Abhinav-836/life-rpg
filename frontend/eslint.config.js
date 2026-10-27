import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const browserGlobals = Object.fromEntries(
  [
    'window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'fetch', 'console',
    'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame',
    'cancelAnimationFrame', 'Audio', 'URL', 'URLSearchParams', 'Intl', 'AbortController',
    'Event', 'CustomEvent', 'performance', 'matchMedia',
  ].map((name) => [name, 'readonly']),
);

const testGlobals = Object.fromEntries(
  ['describe', 'it', 'test', 'expect', 'vi', 'beforeEach', 'afterEach', 'global'].map((n) => [n, 'readonly']),
);

export default [
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...react.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Apostrophes in JSX text are fine in React 17+.
      'react/no-unescaped-entities': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  {
    files: ['tests/**/*.{js,jsx}'],
    languageOptions: { globals: testGlobals },
  },
  {
    files: ['*.config.js'],
    languageOptions: { sourceType: 'module', globals: { process: 'readonly' } },
  },
];
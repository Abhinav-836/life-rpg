import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.jsx';
import './styles/index.css';
import './styles/animations.css';
import './styles/themes.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* Vercel Web Analytics: page views and visitors (no cookies) */}
    <Analytics />
  </StrictMode>
);

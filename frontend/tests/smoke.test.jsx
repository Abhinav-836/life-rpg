import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App.jsx';

describe('App', () => {
  it('renders the landing page hero without crashing', async () => {
    render(<App />);
    expect(await screen.findByText(/Turn your real life into an epic adventure/i)).toBeInTheDocument();
  });
});

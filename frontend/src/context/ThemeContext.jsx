import { createContext, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

// Single theme ships in this batch (dark fantasy). This context exists so
// Settings > Theme preferences has something real to wire up, and so a
// future alt theme is a data change, not a rewrite.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark-fantasy');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

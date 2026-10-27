import { createContext, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

// Dark Fantasy is the only theme today. Keeping it in context means a new
// theme is a data change, not a rewrite.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark-fantasy');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
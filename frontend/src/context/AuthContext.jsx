import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as authApi from '../services/auth.api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const queryClient = useQueryClient();

  // Switching accounts must never show the previous account's cached
  // quests, gold or settings, so the query cache is dropped on every
  // sign-in and sign-out.
  const startSession = useCallback((session) => {
    queryClient.clear();
    setUser(session.user);
    setToken(session.token);
    return session;
  }, [queryClient]);

  useEffect(() => {
    let active = true;
    authApi.getSession().then((session) => {
      if (!active) return;
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
      setInitializing(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    return startSession(await authApi.login(credentials));
  }, [startSession]);

  const signup = useCallback(async (data) => {
    return startSession(await authApi.signup(data));
  }, [startSession]);

  // "Try the demo": signs in to a fresh, private demo account.
  const guestLogin = useCallback(async () => {
    return startSession(await authApi.guestLogin());
  }, [startSession]);

  const logout = useCallback(async () => {
    await authApi.logout();
    queryClient.clear();
    setUser(null);
    setToken(null);
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!token, initializing, login, signup, guestLogin, logout }),
    [user, token, initializing, login, signup, guestLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
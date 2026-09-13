import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '../services/auth.api.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

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
    const session = await authApi.login(credentials);
    setUser(session.user);
    setToken(session.token);
    return session;
  }, []);

  const signup = useCallback(async (data) => {
    const session = await authApi.signup(data);
    setUser(session.user);
    setToken(session.token);
    return session;
  }, []);

  // NEW: backs "Continue as guest" - see auth.api.js / backend
  // auth.service.js for why this replaced hardcoded login credentials.
  const guestLogin = useCallback(async () => {
    const session = await authApi.guestLogin();
    setUser(session.user);
    setToken(session.token);
    return session;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated: !!token, initializing, login, signup, guestLogin, logout }),
    [user, token, initializing, login, signup, guestLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
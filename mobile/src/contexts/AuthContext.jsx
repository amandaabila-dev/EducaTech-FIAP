import { createContext, useContext, useEffect, useState } from 'react';

import {
  clearSession,
  login as loginRequest,
  readSession,
  saveSession,
  setUnauthorizedHandler,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let ativo = true;

    readSession().then((session) => {
      if (ativo) {
        setUser(session);
        setReady(true);
      }
    });

    setUnauthorizedHandler(() => setUser(null));

    return () => {
      ativo = false;
      setUnauthorizedHandler(null);
    };
  }, []);

  async function login(email, password) {
    const { token, user: loggedUser } = await loginRequest(email, password);
    const logged = { ...loggedUser, token };
    await saveSession(logged);
    setUser(logged);
    return logged;
  }

  async function logout() {
    await clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, isAuthenticated: Boolean(user?.token), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
}

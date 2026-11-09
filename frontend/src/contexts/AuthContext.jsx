import { createContext, useContext, useEffect, useState } from 'react';

import { clearSession, login as loginRequest, SESSION_STORAGE_KEY } from '../services/api';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed?.token ? parsed : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    function onUnauthorized() {
      setUser(null);
    }

    window.addEventListener('educatech:unauthorized', onUnauthorized);
    return () => window.removeEventListener('educatech:unauthorized', onUnauthorized);
  }, []);

  async function login(email, password) {
    const { token, user: loggedUser } = await loginRequest(email, password);
    const logged = { ...loggedUser, token };
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(logged));
    setUser(logged);
    return logged;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user?.token), login, logout }}>
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

import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'educatech.sessao';

const CREDENTIALS = {
  email: import.meta.env.VITE_AUTH_EMAIL || 'professor@educatech.com',
  password: import.meta.env.VITE_AUTH_PASSWORD || 'educatech123',
  name: import.meta.env.VITE_AUTH_NAME || 'Prof. Amanda Abila Melo',
};

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(email, password) {
    const emailInformado = String(email || '').trim().toLowerCase();
    const senhaInformada = String(password || '');

    if (
      emailInformado !== CREDENTIALS.email.toLowerCase() ||
      senhaInformada !== CREDENTIALS.password
    ) {
      throw new Error('E-mail ou senha inválidos.');
    }

    const logged = { email: CREDENTIALS.email, name: CREDENTIALS.name, role: 'professor' };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logged));
    setUser(logged);
    return logged;
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, logout }}>
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

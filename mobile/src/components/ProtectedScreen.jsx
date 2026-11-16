import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';

export default function ProtectedScreen({ navigation, children }) {
  const { isAuthenticated, ready } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated, navigation, ready]);

  if (!ready || !isAuthenticated) return null;

  return children;
}

'use client';

import { useEffect, type ReactNode } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isSessionValid = await checkSession();

        if (!isSessionValid) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();

        setUser(user);
      } catch {
        clearIsAuthenticated();
      }
    };

    void checkAuth();
  }, [setUser, clearIsAuthenticated]);

  return children;
}

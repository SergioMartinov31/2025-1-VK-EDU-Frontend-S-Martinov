import { useEffect, useState } from 'react';
import { clearSession, getSavedUser, getToken } from '../../shared/lib/auth/session';
import { request } from '../../shared/api';

import type { User } from '../../entities/user/model/types';

interface AuthSession {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authChecking: boolean;
}


interface AuthResponse {
  authenticated: boolean;
}


export const useAuthSession = (): AuthSession => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const savedUser = getSavedUser<User | null>();

      if (!token || !savedUser) {
        setAuthChecking(false);
        return;
      }

      try {
        const data = await request<AuthResponse>('/api/check-auth');

        if (data?.authenticated) {
          setIsAuthenticated(true);
          setCurrentUser(savedUser);
        } else {
          clearSession();
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        clearSession();
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    authChecking,
  };
};

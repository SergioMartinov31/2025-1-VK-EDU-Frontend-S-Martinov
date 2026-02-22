import { useEffect, useState } from 'react';
import { clearSession, getSavedUser, getToken } from '../../shared/lib/auth/session';
import { request } from '../../shared/api';

export const useAuthSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const savedUser = getSavedUser();

      if (!token || !savedUser) {
        setAuthChecking(false);
        return;
      }

      try {
        const data = await request('/api/check-auth');

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

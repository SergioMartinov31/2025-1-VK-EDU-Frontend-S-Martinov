import { useEffect, useState } from 'react';

export const useAuthSession = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          const response = await fetch('/api/check-auth', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (data.authenticated) {
            setIsAuthenticated(true);
            setCurrentUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Ошибка проверки авторизации:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setAuthChecking(false);
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

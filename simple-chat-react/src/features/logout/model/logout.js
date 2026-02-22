import { clearSession } from '../../../shared/lib/auth/session';

export const logout = ({ setIsAuthenticated, setCurrentUser }) => {
  clearSession();
  setIsAuthenticated(false);
  setCurrentUser(null);
};

import { clearSession } from '../../../shared/lib/auth/session';
import type { User } from '../../../entities/user';


interface LogoutParams {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setCurrentUser: (user: User) => void;
}

export const logout = ({ setIsAuthenticated, setCurrentUser }: LogoutParams) => {
  clearSession();
  setIsAuthenticated(false);
  setCurrentUser(null);
};

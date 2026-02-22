export const logout = (setIsAuthenticated, setCurrentUser) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setIsAuthenticated(false);
  setCurrentUser(null);
}
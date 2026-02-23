export interface SessionData<T = unknown> {
  token: string | null
  user: T | null
}

export const TOKEN_KEY = 'token'
export const USER_KEY = 'user'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setSession = ({ token, user } : SessionData) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getSavedUser = <T = unknown>(): T | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

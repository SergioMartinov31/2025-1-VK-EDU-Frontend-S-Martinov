import { describe, expect, test, beforeEach } from '@jest/globals';
import { 
  TOKEN_KEY, 
  USER_KEY, 
  getToken, 
  setSession, 
  clearSession, 
  getSavedUser,
  type SessionData 
} from './session';

beforeEach(() => {
  localStorage.clear();
});

describe('Session utilities', () => {
  test('getToken возвращает null если токена нет', () => {
    expect(getToken()).toBeNull();
  });

  test('setSession сохраняет токен в localStorage', () => {
    const session: SessionData = { token: 'test-token', user: null };
    
    setSession(session);
    
    expect(localStorage.getItem(TOKEN_KEY)).toBe('test-token');
    expect(getToken()).toBe('test-token');
  });

  test('setSession сохраняет пользователя в localStorage', () => {
    const user = { id: 1, name: 'Test User' };
    const session: SessionData = { token: null, user };
    
    setSession(session);
    
    expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(user));
  });

  test('setSession сохраняет и токен и пользователя вместе', () => {
    const user = { id: 1, name: 'Test User' };
    const session: SessionData = { token: 'test-token', user };
    
    setSession(session);
    
    expect(localStorage.getItem(TOKEN_KEY)).toBe('test-token');
    expect(localStorage.getItem(USER_KEY)).toBe(JSON.stringify(user));
  });

  test('clearSession удаляет все данные', () => {
    setSession({ token: 'test-token', user: { id: 1 } });
    
    clearSession();
    
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(getToken()).toBeNull();
    expect(getSavedUser()).toBeNull();
  });

  test('getSavedUser возвращает null если пользователя нет', () => {
    expect(getSavedUser()).toBeNull();
  });

  test('getSavedUser возвращает сохраненного пользователя', () => {
    const user = { id: 1, name: 'Test User', email: 'test@test.com' };
    setSession({ token: null, user });
    
    const savedUser = getSavedUser<typeof user>();
    
    expect(savedUser).toEqual(user);
  });

  test('getSavedUser возвращает null при поврежденном JSON', () => {
    localStorage.setItem(USER_KEY, '{this is not json}');
    
    expect(getSavedUser()).toBeNull();
  });

  test('setSession не сохраняет token если он null', () => {
    setSession({ token: null, user: null });
    
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  test('setSession не сохраняет user если он null', () => {
    setSession({ token: 'test', user: null });
    
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
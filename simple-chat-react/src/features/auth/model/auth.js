import { loginApi, registerApi } from '../api/authApi';
import { setSession } from '../../../shared/lib/auth/session';

export const auth = async ({ isLogin, username, password }) => {
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Введите логин и пароль');
  }

  const payload = { username, password };
  const data = isLogin ? await loginApi(payload) : await registerApi(payload);

  setSession({ token: data.token, user: data.user });

  return { user: data.user || null, token: data.token || null };
};

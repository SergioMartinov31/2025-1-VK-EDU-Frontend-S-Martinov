import { loginApi, registerApi } from '../api/authApi';
import { setSession } from '../../../shared/lib';
import type { User } from '../../../entities/user';

interface AuthParams {
  isLogin: boolean;
  username: string;
  password: string;
}

interface AuthResult {
  token: string | null;
  user: User | null;
}

export const auth = async ({ isLogin, username, password }: AuthParams): Promise<AuthResult> => {
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Введите логин и пароль');
  }

  const payload = { username, password };
  const data = isLogin ? await loginApi(payload) : await registerApi(payload);

  setSession({ token: data.token, user: data.user });

  return { user: data.user || null, token: data.token || null };
};

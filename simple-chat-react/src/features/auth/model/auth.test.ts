import { auth } from './auth';
import { loginApi, registerApi } from '../api/authApi';
import { setSession } from '../../../shared/lib';

jest.mock('../api/authApi', () => ({
  loginApi: jest.fn(),
  registerApi: jest.fn()
}));

jest.mock('../../../shared/lib', () => ({
  setSession: jest.fn()
}));

describe('auth', () => {
  const mockUser = { id: 1, username: 'test' };
  const mockToken = 'token123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('успешный логин', async () => {
    (loginApi as jest.Mock).mockResolvedValueOnce({
      token: mockToken,
      user: mockUser
    });

    const result = await auth({
      isLogin: true,
      username: 'test',
      password: '123'
    });

    expect(loginApi).toHaveBeenCalledWith({
      username: 'test',
      password: '123'
    });
    expect(setSession).toHaveBeenCalledWith({
      token: mockToken,
      user: mockUser
    });
    expect(result).toEqual({ user: mockUser, token: mockToken });
  });

  test('успешная регистрация', async () => {
    (registerApi as jest.Mock).mockResolvedValueOnce({
      token: mockToken,
      user: mockUser
    });

    const result = await auth({
      isLogin: false,
      username: 'test',
      password: '123'
    });

    expect(registerApi).toHaveBeenCalled();
    expect(setSession).toHaveBeenCalled();
    expect(result).toEqual({ user: mockUser, token: mockToken });
  });

  test('валидация: пустой логин', async () => {
    await expect(auth({
      isLogin: true,
      username: '',
      password: '123'
    })).rejects.toThrow('Введите логин и пароль');

    expect(loginApi).not.toHaveBeenCalled();
  });

  test('валидация: пустой пароль', async () => {
    await expect(auth({
      isLogin: true,
      username: 'test',
      password: '   '
    })).rejects.toThrow('Введите логин и пароль');

    expect(loginApi).not.toHaveBeenCalled();
  });

  test('пробрасывает ошибки от API', async () => {
    const apiError = new Error('User already exists');
    (registerApi as jest.Mock).mockRejectedValueOnce(apiError);

    await expect(auth({
      isLogin: false,
      username: 'test',
      password: '123'
    })).rejects.toThrow('User already exists');
  });
});
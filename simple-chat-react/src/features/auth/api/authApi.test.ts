
import { loginApi, registerApi } from './authApi';
import { request } from '../../../shared/api';

jest.mock('../../../shared/api', () => ({
  request: jest.fn()
}));

describe('authApi', () => {
  const mockPayload = { username: 'test', password: '123' };
  const mockResponse = { token: 'abc', user: { id: 1 } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loginApi вызывает request с правильными параметрами', async () => {
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await loginApi(mockPayload);

    expect(request).toHaveBeenCalledWith(
      '/api/login',
      { method: 'POST', body: mockPayload }
    );
    expect(result).toEqual(mockResponse);
  });

  test('registerApi вызывает request с правильными параметрами', async () => {
    (request as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result = await registerApi(mockPayload);

    expect(request).toHaveBeenCalledWith(
      '/api/register',
      { method: 'POST', body: mockPayload }
    );
    expect(result).toEqual(mockResponse);
  });

  test('пробрасывает ошибки от request', async () => {
    const mockError = new Error('Network error');
    (request as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(loginApi(mockPayload)).rejects.toThrow('Network error');
  });
});
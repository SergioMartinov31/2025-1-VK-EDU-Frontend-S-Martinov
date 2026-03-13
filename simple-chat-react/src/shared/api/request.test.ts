import { request } from './request';

import { getToken } from '../lib/auth/session';

jest.mock('../lib/auth/session', () => ({
  getToken: jest.fn()
}));

jest.mock('../config', () => ({
  config: {
    API_URL: 'http://test-api.com'
  }
}));

type MockFetchResponse = { ok: boolean; json: () => Promise<unknown> };
const fetchMock = jest.fn<Promise<MockFetchResponse>, [RequestInfo | URL, RequestInit?]>();
(globalThis as unknown as { fetch: typeof fetchMock }).fetch = fetchMock;

describe('request', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getToken).mockReset();
  });

  test('1. добавляет токен в заголовки', async () => {
    jest.mocked(getToken).mockReturnValue('my-test-token');

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' })
    });

    await request('/users');

    expect(fetchMock).toHaveBeenCalledWith(
      'http://test-api.com/users', 
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer my-test-token'
        },
        body: undefined
      }
    );
  });

  test('2. добавляет Content-Type: application/json для обычных данных', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({})
  });

  await request('/users', {
    method: 'POST',
    body: { name: 'John' } 
  });

  expect(fetchMock).toHaveBeenCalledWith(
    'http://test-api.com/users',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ name: 'John' })
    }
  );
});


test('3. возвращает данные при успешном ответе', async () => {
  const mockUser = { id: 1, name: 'John' };
  
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => mockUser
  });

  const result = await request('/user/1');
  
  expect(result).toEqual(mockUser);
});

});

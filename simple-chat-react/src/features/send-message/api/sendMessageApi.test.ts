import { request } from '../../../shared/api';
import { sendMessageApi } from './sendMessageApi';


jest.mock('../../../shared/api', () => ({
  request: jest.fn()
}));


describe('sendMessageApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('вызывает request с правильными параметрами', async () => {
    const payload = {
      chatId: 123,
      text: 'Привет!'
    };

    const requestMock = jest.mocked(request);
    requestMock.mockResolvedValue({
      success: true,
      chats: []
    });

    await sendMessageApi(payload);

    expect(requestMock).toHaveBeenCalledWith(
      '/api/chats/123/messages',
      {
        method: 'POST',
        body: { text: 'Привет!' }
      }
    );
  });


  test('возвращает результат от request', async () => {
    const mockResponse = {
      success: true,
      chats: [{ id: 1, name: 'Чат' }]
    };

    const requestMock = jest.mocked(request);
    requestMock.mockResolvedValue(mockResponse);

    const result = await sendMessageApi({
      chatId: 123,
      text: 'Привет'
    });

    expect(result).toEqual(mockResponse);
  });
});

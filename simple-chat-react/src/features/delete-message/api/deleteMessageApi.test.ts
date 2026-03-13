import { describe, expect, test } from '@jest/globals';
import { deleteMessageApi } from './deleteMessageApi';
import { request } from '../../../shared/api';

jest.mock('../../../shared/api', () => ({
  request: jest.fn(),
}));

describe('deleteMessageApi', () => {
  test('calls request with DELETE /api/chats/:id/messages and messageId in body', async () => {
    const requestMock = jest.mocked(request);
    requestMock.mockResolvedValue({ success: true });

    const result = await deleteMessageApi({ chatId: 10, messageId: 5 });

    expect(requestMock).toHaveBeenCalledWith('/api/chats/10/messages', {
      method: 'DELETE',
      body: { messageId: 5 },
    });
    expect(result).toEqual({ success: true });
  });
});

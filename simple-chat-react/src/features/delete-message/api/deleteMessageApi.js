import { request } from '../../../shared/api';

export const deleteMessageApi = async ({ chatId, messageId }) =>
  request(`/api/chats/${chatId}/messages`, {
    method: 'DELETE',
    body: { messageId },
  });

import { request } from '../../../shared/api';

export const sendMessageApi = async ({ chatId, text }) =>
  request(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: { text },
  });

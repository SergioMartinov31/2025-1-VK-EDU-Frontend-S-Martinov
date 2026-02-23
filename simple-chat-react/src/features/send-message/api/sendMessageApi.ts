import { request } from '../../../shared/api';
import type { Chat } from '../../../entities/chat';

interface SendMessagePayload {
  chatId: number;
  text: string;
}

interface SendMessageResponse {
  success: boolean;
  chats: Chat[];
}

export const sendMessageApi = async ({ chatId, text }: SendMessagePayload) =>
  request<SendMessageResponse>(`/api/chats/${chatId}/messages`, {
    method: 'POST',
    body: { text },
  });

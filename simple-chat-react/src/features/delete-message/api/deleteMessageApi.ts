import { request } from '../../../shared/api';

interface DeleteMessageResponse {
  success: boolean;
}

interface DeleteMessageApiParams {
  chatId: number;
  messageId: number;
}

export const deleteMessageApi = async ({ chatId, messageId }: DeleteMessageApiParams): Promise<DeleteMessageResponse> =>
  request<DeleteMessageResponse, { messageId: number }>(`/api/chats/${chatId}/messages`, {
    method: 'DELETE',
    body: { messageId },
  });

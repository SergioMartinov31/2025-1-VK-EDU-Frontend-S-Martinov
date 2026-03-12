import { rtkApi } from '../../../shared/api/rtkApi';
import type { Chat } from '../model/types';

interface SendMessagePayload {
  chatId: number;
  text: string;
}

interface SendMessageResponse {
  success: boolean;
  chats: Chat[];
}

interface DeleteMessagePayload {
  chatId: number;
  messageId: number;
}

interface DeleteMessageResponse {
  success: boolean;
}

interface UploadVoiceMessagePayload {
  chatId: number;
  file: File;
  duration?: number;
}

interface UploadVoiceMessageResponse {
  success: boolean;
}

export const chatApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getChats: build.query<Chat[], void>({
      query: () => ({ url: '/api/chats', method: 'GET' }),
      providesTags: ['Chats'],
    }),
    sendMessage: build.mutation<SendMessageResponse, SendMessagePayload>({
      query: ({ chatId, text }) => ({
        url: `/api/chats/${chatId}/messages`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Chats'],
    }),
    deleteMessage: build.mutation<DeleteMessageResponse, DeleteMessagePayload>({
      query: ({ chatId, messageId }) => ({
        url: `/api/chats/${chatId}/messages`,
        method: 'DELETE',
        body: { messageId },
      }),
      invalidatesTags: ['Chats'],
    }),
    uploadVoiceMessage: build.mutation<UploadVoiceMessageResponse, UploadVoiceMessagePayload>({
      query: ({ chatId, file, duration = 0 }) => {
        const formData = new FormData();
        formData.append('voice', file);
        formData.append('duration', String(duration));

        return {
          url: `/api/chats/${chatId}/voice-upload`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Chats'],
    }),
  }),
});

export const { useGetChatsQuery, useSendMessageMutation, useDeleteMessageMutation, useUploadVoiceMessageMutation } = chatApi;

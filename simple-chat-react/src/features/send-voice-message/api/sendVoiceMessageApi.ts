import { request } from '../../../shared/api';
import type { Chat } from '../../../entities/chat/model/types';

export interface SendVoiceMessageApiPayload {
  chatId: number;
  file: File;
  duration?: number;
}

export interface SendVoiceMessageApiResponse {
  success: boolean;
  chats: Chat[];
  message?: {
    isOurs: boolean;
    text: string;
    time: string;
    voiceMessageObj?: unknown;
  };
}

export const sendVoiceMessageApi = ({
  chatId,
  file,
  duration = 0,
}: SendVoiceMessageApiPayload) => {
  const formData = new FormData();
  formData.append('voice', file);
  formData.append('duration', String(duration));

  return request<SendVoiceMessageApiResponse, FormData>(`/api/chats/${chatId}/voice-upload`, {
    method: 'POST',
    body: formData,
  });
};

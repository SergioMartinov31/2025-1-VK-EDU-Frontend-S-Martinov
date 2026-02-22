import { request } from '../../../shared/api';

export const sendVoiceMessageApi = async ({ chatId, file, duration = 0 }) => {
  const formData = new FormData();
  formData.append('voice', file);
  formData.append('duration', duration);

  return request(`/api/chats/${chatId}/voice-upload`, {
    method: 'POST',
    body: formData,
  });
};

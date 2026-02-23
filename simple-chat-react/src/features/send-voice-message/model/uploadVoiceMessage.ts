import { sendVoiceMessageApi } from '../api/sendVoiceMessageApi';
import type { Chat } from '../../../entities/chat/model/types';

interface UploadVoiceMessageParams {
  chatId: number;
  file: File;
  duration?: number;
  setChats: (chats: Chat[]) => void;
}

export const uploadVoiceMessage = async ({ chatId, file, duration, setChats }: UploadVoiceMessageParams): Promise<void> => {
  try {
    const result = await sendVoiceMessageApi({ chatId, file, duration });
    if (result?.chats) {
      setChats(result.chats);
    }
  } catch (error) {
    console.error('Ошибка при отправке голосового сообщения:', error);
    throw error;
  }
};

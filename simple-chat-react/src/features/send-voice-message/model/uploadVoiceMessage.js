import { sendVoiceMessageApi } from '../api/sendVoiceMessageApi';

export const uploadVoiceMessage = async ({ chatId, file, duration, setChats }) => {
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

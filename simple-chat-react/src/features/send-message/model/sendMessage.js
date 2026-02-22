import { sendMessageApi } from '../api/sendMessageApi';

export const sendMessage = async ({ chatId, messageObj, setChats }) => {
  if (messageObj?.type !== 'text') return;

  try {
    const updatedChats = await sendMessageApi({ chatId, text: messageObj.text });
    setChats(updatedChats.chats);
  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
};

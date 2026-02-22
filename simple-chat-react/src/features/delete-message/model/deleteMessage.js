import { deleteMessageApi } from '../api/deleteMessageApi';

export const deleteMessage = async ({ chatId, messageId, setChats }) => {
  try {
    const updatedChats = await deleteMessageApi({ chatId, messageId });
    setChats(updatedChats.chats);
  } catch (error) {
    console.error('Ошибка при удалении сообщения:', error);
  }
};

import { deleteMessageFromChat } from '../../shared/api/chatsAPI.js';

export const deleteMessage = async (chatId, messageId, setChats) => {
  try {
    const updatedChats = await deleteMessageFromChat(chatId, messageId);
    setChats(updatedChats.chats); 
  } catch (error) {
    console.error('Ошибка при удалении сообщения:', error);
  }
};

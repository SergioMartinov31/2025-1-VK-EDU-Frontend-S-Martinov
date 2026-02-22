import { addMyMessageToChat } from '../../shared/api/chatsAPI.js';

export const sendMessage = async (chatId, messageObj, setChats) => {
  if (messageObj.type === "text") {
    try {
      const updatedChats = await addMyMessageToChat(chatId, messageObj.text);
      setChats(updatedChats.chats);
    } catch (error) {
      console.error('Ошибка отправки:', error);
    }
  }
};

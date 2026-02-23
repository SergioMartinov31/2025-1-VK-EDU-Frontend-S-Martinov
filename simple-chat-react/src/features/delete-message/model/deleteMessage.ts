import { deleteMessageApi } from '../api/deleteMessageApi';
import type { Chat } from '../../../entities/chat';
import { getChats } from '../../../entities/chat';


interface DeleteMessageParams {
  chatId: number;
  messageId: number;
  setChats: (chats: Chat[]) => void;
}


export const deleteMessage = async ({ chatId, messageId, setChats }: DeleteMessageParams): Promise<void> => {
  try {
    const result = await deleteMessageApi({ chatId, messageId });

    if (result.success) {
      const updatedChats = await getChats();
      setChats(updatedChats);
    }
  } catch (error) {
    console.error('Ошибка при удалении сообщения:', error);
  }
};

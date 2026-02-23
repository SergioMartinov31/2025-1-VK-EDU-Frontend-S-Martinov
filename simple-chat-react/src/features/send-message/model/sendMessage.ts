import { sendMessageApi } from '../api/sendMessageApi';
import type { Chat } from '../../../entities/chat';

import type { MessageInput } from './types';



interface SendMessageParams {
  chatId: number;
  messageObj: MessageInput;
  setChats: (chats: Chat[]) => void;
}



export const sendMessage = async ({ chatId, messageObj, setChats }: SendMessageParams): Promise<void> => {
  if (messageObj.type !== 'text' || !messageObj.text.trim()) return;

  try {
    const updatedChats = await sendMessageApi({ chatId, text: messageObj.text });
    setChats(updatedChats.chats);
  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
};

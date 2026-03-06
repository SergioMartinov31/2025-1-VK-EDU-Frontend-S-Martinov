import { useEffect } from 'react';
import type { Chat } from '../../entities/chat/model/types';
import { connectSocket, disconnectSocket, getSocket } from '../../shared/lib';

interface UseChatsSocketParams {
  isAuthenticated: boolean;
  token: string | null;
  setChats: (chats: Chat[]) => void;
}

export const useChatsSocket = ({ isAuthenticated, token, setChats }: UseChatsSocketParams) => {
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = connectSocket(token);

    const onChatsSync = (chats: Chat[]) => {
      setChats(chats);
    };

    const onChatError = (payload: { message: string }) => {
      console.error('socket chat error:', payload.message);
    };
    //Подписываемся на события - слушаем
    socket.on('chats:sync', onChatsSync);
    socket.on('chat:error', onChatError);
    //Просим начальные данные - говорим
    socket.emit('chats:request-sync'); 

    return () => {
      const s = getSocket();
      if (!s) return;
      s.off('chats:sync', onChatsSync);
      s.off('chat:error', onChatError);
      disconnectSocket();
    };
  }, [isAuthenticated, token, setChats]);
};

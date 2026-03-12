import { useEffect } from 'react';
import type { Chat } from '../../entities/chat/model/types';
import { useAppDispatch } from '../store/hooks';
import { chatApi } from '../../entities/chat/api/chatApi';
import { connectSocket, disconnectSocket, getSocket } from '../../shared/lib';

interface UseChatsSocketParams {
  isAuthenticated: boolean;
  token: string | null;
}

export const useChatsSocket = ({ isAuthenticated, token }: UseChatsSocketParams) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = connectSocket(token);

	    const onChatsSync = (chats: Chat[]) => {
	      dispatch(
	        chatApi.util.updateQueryData('getChats', undefined, (draft) => {
	          draft.splice(0, draft.length, ...chats);
	        }),
	      );
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
  }, [dispatch, isAuthenticated, token]);
};

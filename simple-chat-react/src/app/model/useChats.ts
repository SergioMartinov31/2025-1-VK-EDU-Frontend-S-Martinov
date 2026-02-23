import { useEffect, useState } from 'react';
import { getChats } from '../../entities/chat';
import { User } from '../../entities/user';
import { Chat} from '../../entities/chat/model/types';

interface UseChatsParams {
  isAuthenticated: boolean;
  currentUser: User | null;
}

interface UseChatsResult {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

export const useChats = ({ isAuthenticated, currentUser }: UseChatsParams): UseChatsResult => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadChats = async () => {
      try {
        const chatsData = await getChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
        setChats([]);
      }
    };

    loadChats();
  }, [isAuthenticated, currentUser]);

  return { chats, setChats };
};

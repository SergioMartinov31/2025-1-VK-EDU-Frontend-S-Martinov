import { useEffect } from 'react';
import { User } from '../../entities/user';
import { Chat} from '../../entities/chat/model/types';
import { useGetChatsQuery } from '../../entities/chat/api/chatApi';

interface UseChatsParams {
  isAuthenticated: boolean;
  currentUser: User | null;
}

interface UseChatsResult {
  chats: Chat[];
}

export const useChats = ({ isAuthenticated, currentUser }: UseChatsParams): UseChatsResult => {
  const { data, error } = useGetChatsQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (error) {
      console.error('Ошибка загрузки чатов:', error);
      return;
    }
  }, [isAuthenticated, currentUser, data, error]);

  return chats;
};

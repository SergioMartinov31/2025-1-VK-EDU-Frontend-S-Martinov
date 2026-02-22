import { useEffect, useState } from 'react';
import { getChats } from '../../entities/chat';

export const useChats = ({ isAuthenticated, currentUser }) => {
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

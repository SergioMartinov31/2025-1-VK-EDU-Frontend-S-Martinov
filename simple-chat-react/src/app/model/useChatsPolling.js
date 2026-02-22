import { useEffect } from 'react';
import { getChats } from '../../entities/chat';

export const useChatsPolling = ({ isAuthenticated, setChats, interval = 5000 }) => {
  useEffect(() => {
    if (!isAuthenticated) return;

    const pollInterval = setInterval(async () => {
      try {
        const updatedChats = await getChats();
        setChats(updatedChats);
      } catch (error) {
        console.error('Ошибка polling:', error);
      }
    }, interval);

    return () => clearInterval(pollInterval);
  }, [isAuthenticated, setChats, interval]);
};

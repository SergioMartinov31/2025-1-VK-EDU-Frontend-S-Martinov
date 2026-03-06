import { useEffect, useState } from 'react';
import { getSocket } from '../../../shared/lib';

export const useOnline = (userId: number) => {
  const [onlineIds, setOnlineIds] = useState<number[]>([]);

  useEffect(() => {
    let cleanupSocket: (() => void) | null = null;

    const attach = () => {
      const socket = getSocket();
      if (!socket) return false;

      const handleOnlineUpdate = (users: number[]) => {
        setOnlineIds(users);
      };

      socket.on('online:update', handleOnlineUpdate);
      socket.emit('online:request-sync');

      cleanupSocket = () => {
        socket.off('online:update', handleOnlineUpdate);
      };
      return true;
    };

    if (attach()) {
      return () => cleanupSocket?.();
    }

    const retryId = window.setInterval(() => {
      if (attach()) {
        window.clearInterval(retryId);
      }
    }, 300);

    return () => {
      window.clearInterval(retryId);
      cleanupSocket?.();
    };
  }, []);

  const isOnline = onlineIds.includes(userId);

  return isOnline;
};

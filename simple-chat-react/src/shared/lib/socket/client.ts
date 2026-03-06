import { io } from 'socket.io-client';
import { config } from '../../config';
import type { TypedSocket } from './types'; 

let socket: TypedSocket | null = null;

export const connectSocket = (token: string) => {
  const currentToken =
    socket && typeof socket.auth === 'object' && socket.auth !== null
      ? (socket.auth as { token?: string }).token
      : undefined;

  // Если пользователь/токен сменились, старое соединение надо пересоздать.
  if (socket && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (socket?.connected) return socket;

  socket = io(config.API_URL, {
    transports: ['websocket'],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }) as TypedSocket; 

  
  socket.on('reconnect', (attempt) => {
    console.log(`🔄 Переподключение после ${attempt} попыток`);
  });

  socket.on('connect', () => {
    console.log('✅ Подключено');
  });

  socket.on('disconnect', (reason) => {
    console.log('🔴 Отключено:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Ошибка:', error.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};

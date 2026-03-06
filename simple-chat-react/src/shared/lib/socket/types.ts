import type { Socket as IoSocket } from 'socket.io-client';
import type { Chat } from '../../../entities/chat/model/types';

export interface ChatErrorPayload {
  message: string;
}

export type ServerToClientEvents = {
  'chats:sync': (chats: Chat[]) => void;
  'chat:error': (payload: ChatErrorPayload) => void;
  'online:update': (users: number[]) => void;
  'video:offer': (payload: {
    from: number;
    fromUsername: string;
    offer: unknown;
  }) => void;
  'video:answer': (payload: {
    from: number;
    answer: unknown;
  }) => void;
  'video:end': () => void;
};

export type ClientToServerEvents = {
  'chats:request-sync': () => void;
  'online:request-sync': () => void;
  'video:offer': (payload: { targetUserId: number; offer: unknown }) => void;
  'video:answer': (payload: { targetUserId: number; answer: unknown }) => void;
  'video:end': (payload: { targetUserId: number }) => void;
};


export interface SocketInternalEvents {
  on(event: 'connect', callback: () => void): this;
  on(event: 'disconnect', callback: (reason: string) => void): this;
  on(event: 'connect_error', callback: (error: Error) => void): this;
  on(event: 'reconnect', callback: (attempt: number) => void): this;
  on(event: 'reconnect_attempt', callback: (attempt: number) => void): this;
}

export type TypedSocket = IoSocket<ServerToClientEvents, ClientToServerEvents> & 
  SocketInternalEvents;

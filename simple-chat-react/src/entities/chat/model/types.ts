import type { Message } from '../../message/model/types';

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  unreadMessages: number;
  messages: Message[];
}

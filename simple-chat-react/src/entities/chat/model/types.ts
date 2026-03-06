import type { Message } from '../../message/model/types';

export interface Chat {
  id: number;
  name: string;
  partnerId?: number | null;
  avatar: string;
  unreadMessages: number;
  messages: Message[];
}

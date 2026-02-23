import { request } from '../../../shared/api';
import type { Chat } from '../model/types';

export const getChats = async () => request<Chat[]>('/api/chats');

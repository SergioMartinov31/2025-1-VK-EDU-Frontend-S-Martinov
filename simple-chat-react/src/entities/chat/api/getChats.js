import { request } from '../../../shared/api';

export const getChats = async () => request('/api/chats');

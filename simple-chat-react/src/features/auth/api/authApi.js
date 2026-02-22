import { request } from '../../../shared/api';

export const loginApi = (payload) => request('/api/login', { method: 'POST', body: payload });
export const registerApi = (payload) => request('/api/register', { method: 'POST', body: payload });

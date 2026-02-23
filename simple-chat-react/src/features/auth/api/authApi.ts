import { request } from '../../../shared/api';
import type { User } from '../../../entities/user';

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthApiResponse {
  token: string;
  user: User;
}

export const loginApi = (payload: AuthPayload) =>
  request<AuthApiResponse, AuthPayload>('/api/login', { method: 'POST', body: payload });

export const registerApi = (payload: AuthPayload) =>
  request<AuthApiResponse, AuthPayload>('/api/register', { method: 'POST', body: payload });

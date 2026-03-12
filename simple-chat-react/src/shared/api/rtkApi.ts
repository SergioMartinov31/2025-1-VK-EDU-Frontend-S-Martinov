import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { config } from '../config';
import { getToken } from '../lib/auth/session';

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Chats'],
  endpoints: () => ({}),
});

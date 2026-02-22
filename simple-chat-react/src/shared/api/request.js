import { getToken } from '../lib/auth/session';
import { config } from '../config';

const buildHeaders = (headers, body) => {
  const result = { ...(headers || {}) };
  const token = getToken();

  if (token) {
    result.Authorization = `Bearer ${token}`;
  }

  const hasFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!hasFormData && body !== undefined && !result['Content-Type']) {
    result['Content-Type'] = 'application/json';
  }

  return result;
};

export const request = async (path, options = {}) => {
  const { method = 'GET', headers, body } = options;

  const response = await fetch(`${config.API_URL}${path}`, {
    method,
    headers: buildHeaders(headers, body),
    body:
      body === undefined || (typeof FormData !== 'undefined' && body instanceof FormData)
        ? body
        : JSON.stringify(body),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.error || `HTTP error! status: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

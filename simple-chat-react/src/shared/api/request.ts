import { getToken } from '../lib/auth/session';
import { config } from '../config';

type HeadersObject = Record<string, string | undefined>;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

interface RequestOptions<T = unknown> {
  method?: HttpMethod;
  headers?: HeadersObject;
  body?: T | FormData;
}

interface ErrorPayload {
  error?: string;
}

interface ApiError extends Error {
  status: number;
  payload: unknown;
}

const buildHeaders = (headers: HeadersObject | undefined, body: unknown): HeadersObject => {
  const result: HeadersObject = { ...(headers || {}) };
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

export const request = async <TResponse = unknown, TBody = unknown>(path: string, options: RequestOptions<TBody> = {}): Promise<TResponse> => {
  const { method = 'GET', headers, body } = options;
  const hasFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const preparedBody: BodyInit | undefined =
    body === undefined ? undefined : hasFormData ? body : JSON.stringify(body);

  const response = await fetch(`${config.API_URL}${path}`, {
    method,
    headers: buildHeaders(headers, body),
    body: preparedBody,
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'error' in data
        ? ((data as ErrorPayload).error || `HTTP error! status: ${response.status}`)
        : `HTTP error! status: ${response.status}`;
    const error = new Error(message) as ApiError;
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data as TResponse;
};

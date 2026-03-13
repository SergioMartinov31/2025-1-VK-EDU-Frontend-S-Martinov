import { beforeEach, describe, expect, test } from '@jest/globals';
import { sendVoiceMessageApi } from './sendVoiceMessageApi';
import { request } from '../../../shared/api';

jest.mock('../../../shared/api', () => ({
  request: jest.fn(),
}));

class MockFormData {
  private readonly entries = new Map<string, unknown[]>();

  append(key: string, value: unknown): void {
    const list = this.entries.get(key) ?? [];
    list.push(value);
    this.entries.set(key, list);
  }

  getAll(key: string): unknown[] {
    return this.entries.get(key) ?? [];
  }
}

describe('sendVoiceMessageApi', () => {
  beforeEach(() => {
    // Jest in node env doesn't provide FormData, so we polyfill it.
    (globalThis as unknown as { FormData: typeof FormData }).FormData =
      MockFormData as unknown as typeof FormData;
  });

  test('posts FormData with voice file and duration', async () => {
    const requestMock = jest.mocked(request);
    requestMock.mockResolvedValue({ success: true, chats: [] });

    const fakeFile = { name: 'voice.webm' } as unknown as File;
    await sendVoiceMessageApi({ chatId: 7, file: fakeFile, duration: 12 });

    expect(requestMock).toHaveBeenCalledTimes(1);
    const [url, options] = requestMock.mock.calls[0] as [string, { method: string; body: unknown }];

    expect(url).toBe('/api/chats/7/voice-upload');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(MockFormData);

    const body = options.body as unknown as MockFormData;
    expect(body.getAll('voice')[0]).toBe(fakeFile);
    expect(body.getAll('duration')[0]).toBe('12');
  });
});

import { connectSocket, disconnectSocket, getSocket } from './client';
import { io } from 'socket.io-client';

jest.mock('socket.io-client', () => ({
  io: jest.fn()
}));

describe('Socket connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (io as jest.Mock).mockImplementation((_url: string, options?: { auth?: { token?: string } }) => {
      return {
        connected: true,
        disconnect: jest.fn(),
        on: jest.fn(),
        // `connectSocket` relies on `socket.auth.token` to decide whether to reuse the connection.
        auth: options?.auth ?? {},
      };
    });
  });

  afterEach(() => {
    disconnectSocket();
  });

  test('connectSocket создает новое соединение если нет сокета', () => {
    const socket = connectSocket('token-123');
    
    expect(io).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        auth: { token: 'token-123' }
      })
    );
    expect(socket).toBe(getSocket());
  });

  test('connectSocket пересоздает сокет при смене токена', () => {

    const first = connectSocket('token-a');
    
    const socket = connectSocket('token-b');
    

    expect(first.disconnect).toHaveBeenCalled();
    expect(io).toHaveBeenCalledTimes(2);
    expect(socket).toBe(getSocket());
  });

  test('connectSocket не создает новый сокет если уже есть с таким токеном', () => {
    connectSocket('token-123');
    connectSocket('token-123');
    
    expect(io).toHaveBeenCalledTimes(1);
  });

  test('disconnectSocket отключает и очищает сокет', () => {
    const socket = connectSocket('token-123');
    
    disconnectSocket();
    
    expect(socket.disconnect).toHaveBeenCalled();
    expect(getSocket()).toBeNull();
  });
});

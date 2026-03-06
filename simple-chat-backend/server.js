import http from 'http';
import { Server } from 'socket.io';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';

import {
  getChats,
  getChatsList,
  getChatById,
  addMessageToChat,
  addMyVoiceMessageToChat,
  deleteMessageFromChat,
  registerUser,
  loginUser,
  verifyToken,
  getAllUsers,
} from './data/chats.js';

const app = express();
const PORT = 3001;

const onlineUsers = new Set(); // {1, 2, 3} - кто онлайн - Socket.user.id

// ============ HTTP + SOCKET SERVER ============
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// helper: отправить актуальные чаты конкретному пользователю
const emitChatsSyncToUser = (userId) => {
  const chats = getChats(userId);
  io.to(`user:${userId}`).emit('chats:sync', chats);
};

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());
app.use('/avatars', express.static('avatars'));
app.use('/uploads', express.static('uploads'));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Токен отсутствует' });
  }

  const token = authHeader.substring(7);
  const verification = verifyToken(token);

  if (!verification.valid) {
    return res.status(401).json({ success: false, error: 'Неверный токен' });
  }

  req.user = verification.user;
  next();
};

// ============ FILE UPLOAD ============
const uploadDir = './uploads/voice';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// ============ SOCKET AUTH + EVENTS ============
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token'));

  const verification = verifyToken(token);
  if (!verification.valid || !verification.user) {
    return next(new Error('Unauthorized'));
  }

  socket.data.user = verification.user;
  next();
});

io.on('connection', (socket) => {
  const userId = socket.data.user.userId;
  
  onlineUsers.add(userId);
  console.log('🟢 Онлайн:', Array.from(onlineUsers));
  io.emit('online:update', Array.from(onlineUsers));
  // room на пользователя: минимально и чисто
  socket.join(`user:${userId}`);

  // initial sync по запросу клиента
  socket.on('chats:request-sync', () => {
    emitChatsSyncToUser(userId);
  });

  socket.on('online:request-sync', () => {
    socket.emit('online:update', Array.from(onlineUsers));
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    console.log('🔴 Онлайн:', Array.from(onlineUsers));
    io.emit('online:update', Array.from(onlineUsers));
  });


// 1. Когда Петя звонит Васе
  socket.on('video:offer', ({ targetUserId, offer }) => {
    console.log(`📞 Звонок от ${socket.data.user.username} к ${targetUserId}`);
    // Пересылаем предложение Васе
    io.to(`user:${targetUserId}`).emit('video:offer', {
      from: socket.data.user.userId,
      fromUsername: socket.data.user.username,
      offer
    });
  });

  // 2. Когда Вася отвечает Пете
  socket.on('video:answer', ({ targetUserId, answer }) => {
    io.to(`user:${targetUserId}`).emit('video:answer', {
      from: socket.data.user.userId,
      answer
    });
  });

  // 3. Когда кто-то завершает звонок
  socket.on('video:end', ({ targetUserId }) => {
    io.to(`user:${targetUserId}`).emit('video:end');
  });


});



// ============ PUBLIC ROUTES ============
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Логин и пароль обязательны' });
  }
  if (username.length < 3) {
    return res.status(400).json({ success: false, error: 'Логин должен быть не менее 3 символов' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Пароль должен быть не менее 6 символов' });
  }

  const result = await registerUser(username, password);
  if (!result.success) return res.status(400).json(result);

  // после регистрации у всех может измениться список чатов
  getAllUsers().forEach((user) => emitChatsSyncToUser(user.id));

  res.json(result);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Логин и пароль обязательны' });
  }

  const result = await loginUser(username, password);
  if (!result.success) return res.status(401).json(result);

  res.json(result);
});

app.get('/api/check-auth', authenticateToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// ============ PROTECTED ROUTES ============
app.get('/api/chats', authenticateToken, (req, res) => {
  const chats = getChats(req.user.userId);
  res.json(chats);
});

app.get('/api/chats-list', authenticateToken, (req, res) => {
  const chatsList = getChatsList(req.user.userId);
  res.json(chatsList);
});

app.post('/api/chats/:id/messages', authenticateToken, (req, res) => {
  const chatId = Number.parseInt(req.params.id, 10);
  const userId = req.user.userId;
  const { text } = req.body;

  if (Number.isNaN(chatId)) {
    return res.status(400).json({ success: false, error: 'Некорректный chatId' });
  }
  if (!text || text.trim() === '') {
    return res.status(400).json({ success: false, error: 'Текст сообщения не может быть пустым' });
  }

  const newMessage = addMessageToChat(chatId, userId, text);
  if (!newMessage) {
    return res.status(403).json({ success: false, error: 'Доступ к чату запрещен или чат не найден' });
  }

  const chat = getChatById(chatId, userId);
  const participantIds = chat?.participants || [userId];
  participantIds.forEach((id) => emitChatsSyncToUser(id));

  res.json({
    success: true,
    message: newMessage,
    chats: getChats(userId),
  });
});

app.post('/api/chats/:id/voice-upload', authenticateToken, upload.single('voice'), (req, res) => {
  const chatId = Number.parseInt(req.params.id, 10);
  const userId = req.user.userId;
  const file = req.file;
  const { duration } = req.body;

  if (Number.isNaN(chatId)) {
    return res.status(400).json({ success: false, error: 'Некорректный chatId' });
  }
  if (!file) {
    return res.status(400).json({ success: false, error: 'Файл не загружен' });
  }

  const voiceData = {
    file: `/uploads/voice/${file.filename}`,
    duration: Number(duration),
    mime: file.mimetype,
  };

  const newMessage = addMyVoiceMessageToChat(chatId, userId, voiceData);
  if (!newMessage) {
    fs.unlinkSync(file.path);
    return res.status(403).json({ success: false, error: 'Доступ к чату запрещен или чат не найден' });
  }

  const chat = getChatById(chatId, userId);
  const participantIds = chat?.participants || [userId];
  participantIds.forEach((id) => emitChatsSyncToUser(id));

  res.json({
    success: true,
    message: newMessage,
    chats: getChats(userId),
  });
});

app.delete('/api/chats/:id/messages', authenticateToken, (req, res) => {
  const chatId = Number.parseInt(req.params.id, 10);
  const userId = req.user.userId;
  const { messageId } = req.body;

  if (Number.isNaN(chatId)) {
    return res.status(400).json({ success: false, error: 'Некорректный chatId' });
  }
  if (typeof messageId !== 'number') {
    return res.status(400).json({ success: false, error: 'ID сообщения обязателен' });
  }

  const isDeleted = deleteMessageFromChat(chatId, messageId, userId);
  if (!isDeleted) {
    return res.status(403).json({ success: false, error: 'Не удалось удалить сообщение' });
  }

  const chat = getChatById(chatId, userId);
  const participantIds = chat?.participants || [userId];
  participantIds.forEach((id) => emitChatsSyncToUser(id));

  res.json({ success: true });
});

// ============ DEBUG ============
app.get('/api/debug/users', (_, res) => {
  res.json({ users: getAllUsers() });
});

// ============ ERROR HANDLING ============
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Эндпоинт не найден' });
});

app.use((err, req, res, next) => {
  console.error('❌ Ошибка сервера:', err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: 'Ошибка загрузки файла' });
  }

  res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
});

// ============ START ============
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server + Socket.IO started on http://localhost:${PORT}`);
  console.log(`🌐 В сети: http://192.168.1.113:${PORT}`);
});

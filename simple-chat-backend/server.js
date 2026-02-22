import multer from 'multer';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { 
  getChats, 
  getChatsList, 
  addMessageToChat, 
  addMyVoiceMessageToChat, 
  deleteMessageFromChat,
  registerUser,
  loginUser,
  verifyToken,
  getAllUsers
} from './data/chats.js';

const app = express(); 
const PORT = 3001;

// ⭐ MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use('/avatars', express.static('avatars'));

// Middleware для проверки аутентификации
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Токен отсутствует'
    });
  }
  
  const token = authHeader.substring(7);
  const verification = verifyToken(token);
  
  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: 'Неверный токен'
    });
  }
  
  // Добавляем данные пользователя в запрос
  req.user = verification.user;
  next();
};

// Настройка загрузки файлов
const uploadDir = './uploads/voice';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// ============ PUBLIC ROUTES (без аутентификации) ============

app.post('/api/register', async (req, res) => {
  console.log('📨 Запрос на регистрацию:', req.body.username);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Логин и пароль обязательны'
    });
  }
  
  if (username.length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Логин должен быть не менее 3 символов'
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Пароль должен быть не менее 6 символов'
    });
  }
  
  const result = await registerUser(username, password);
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

app.post('/api/login', async (req, res) => {
  console.log('📨 Запрос на вход:', req.body.username);
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Логин и пароль обязательны'
    });
  }
  
  const result = await loginUser(username, password);
  
  if (!result.success) {
    return res.status(401).json(result);
  }
  
  res.json(result);
});

app.get('/api/check-auth', authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    user: req.user
  });
});

// ============ PROTECTED ROUTES (требуют аутентификации) ============

// Получить все чаты пользователя
app.get('/api/chats', authenticateToken, (req, res) => {
  console.log('📨 Получен запрос на /api/chats от пользователя:', req.user.username);
  
  const userId = req.user.userId;
  const chats = getChats(userId);
  
  res.json(chats);
});

// Получить список чатов (упрощенная версия для боковой панели)
app.get('/api/chats-list', authenticateToken, (req, res) => {
  console.log('📨 Получен запрос на /api/chats-list от пользователя:', req.user.username);
  
  const userId = req.user.userId;
  const chatsList = getChatsList(userId);
  
  res.json(chatsList);
});

// Отправить текстовое сообщение
app.post('/api/chats/:id/messages', authenticateToken, (req, res) => {
  const chatId = parseInt(req.params.id);
  const userId = req.user.userId;
  const { text } = req.body;
  
  console.log(`📨 Пользователь ${req.user.username} отправляет сообщение в чат ${chatId}: "${text}"`);
  
  if (!text || text.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Текст сообщения не может быть пустым'
    });
  }
  
  const newMessage = addMessageToChat(chatId, userId, text);
  
  if (!newMessage) {
    return res.status(403).json({
      success: false,
      error: 'Доступ к чату запрещен или чат не найден'
    });
  }
  
  const updatedChats = getChats(userId);

  res.json({
    success: true,
    message: newMessage,
    chats: updatedChats 
  });
});

// Отправить голосовое сообщение
app.post('/api/chats/:id/voice-upload', authenticateToken, upload.single('voice'), (req, res) => {
  const chatId = parseInt(req.params.id);
  const userId = req.user.userId;
  const file = req.file;
  const { duration } = req.body;

  if (!file) {
    return res.status(400).json({ 
      success: false,
      error: 'Файл не загружен' 
    });
  }

  console.log(`📥 Пользователь ${req.user.username} загружает голосовое в чат ${chatId}: ${file.filename}`);

  const fileUrl = `/uploads/voice/${file.filename}`;
  
  const voiceData = {
    file: fileUrl,
    duration: Number(duration),
    mime: file.mimetype
  };

  const newMessage = addMyVoiceMessageToChat(chatId, userId, voiceData);
  
  if (!newMessage) {
    // Удаляем загруженный файл, если не удалось добавить сообщение
    fs.unlinkSync(file.path);
    return res.status(403).json({
      success: false,
      error: 'Доступ к чату запрещен или чат не найден'
    });
  }

  const updatedChats = getChats(userId);

  res.json({
    success: true,
    message: newMessage,
    chats: updatedChats
  });
});

// Удалить сообщение
app.delete('/api/chats/:id/messages', authenticateToken, (req, res) => {
  const chatId = parseInt(req.params.id);
  const userId = req.user.userId;
  const { messageId } = req.body;

  console.log(`📨 Пользователь ${req.user.username} удаляет сообщение ${messageId} из чата ${chatId}`);
  
  if (typeof messageId !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'ID сообщения обязателен'
    });
  }
  
  const isDeleted = deleteMessageFromChat(chatId, messageId, userId);
  
  if (!isDeleted) {
    return res.status(403).json({
      success: false,
      error: 'Не удалось удалить сообщение'
    });
  }
  
  res.json({ success: true });
});

// ============ ADMIN/DEBUG ROUTES ============

// Получить всех пользователей (для отладки)
app.get('/api/debug/users', (req, res) => {
  const users = getAllUsers();
  res.json({ users });
});

// Статические файлы
app.use('/uploads', express.static('uploads'));

// ============ ERROR HANDLING ============

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Эндпоинт не найден'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('❌ Ошибка сервера:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: 'Ошибка загрузки файла'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Внутренняя ошибка сервера'
  });
});

// ============ SERVER START ============

// app.listen(PORT, () => {
//   console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
//   console.log('📡 Доступные эндпоинты:');
//   console.log('   POST /api/register');
//   console.log('   POST /api/login');
//   console.log('   GET  /api/check-auth');
//   console.log('   GET  /api/chats');
//   console.log('   GET  /api/chats-list');
//   console.log('   POST /api/chats/:id/messages');
//   console.log('   POST /api/chats/:id/voice-upload');
//   console.log('   DELETE /api/chats/:id/messages');
//   console.log('\n🔐 Все эндпоинты кроме /api/register и /api/login требуют токена в заголовке:');
//   console.log('   Authorization: Bearer <ваш_токен>');
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на http://0.0.0.0:${PORT}`);
  console.log(`🌐 Локально: http://localhost:${PORT}`);
  console.log(`🌐 В сети: http://192.168.1.113:${PORT}`);
});
import multer from 'multer';
import path from 'path';
import fs from 'fs';


import express from 'express'; //Обрабатывает HTTP запросы (GET, POST, PUT, DELETE)
import cors from 'cors'; // (Cross-Origin Resource Sharing) - разрешает запросы между разными доменами
import { getChats, getChatsList, addMessageToChat, addMyVoiceMessageToChat, deleteMessageFromChat,createToken,getToken,
  registerUser,loginUser,verifyToken,getAllUsers
} from './data/chats.js';

const app = express(); 
const PORT = 3001;

// ⭐ MIDDLEWARE - обязательные штуки
app.use(cors()); // Разрешаем запросы с фронтенда
app.use(express.json()); // Позволяем читать JSON из тела запроса

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


app.get('/api/chats', (req, res) => {
  console.log('📨 Получен запрос на /api/chats');
  const chats = getChats();
  res.json(chats); // Отправляем данные обратно
});

app.get('/api/chats-list', (req, res) => {
  console.log('📨 Получен запрос на /api/chats-list');
  const chatsList = getChatsList();
  res.json(chatsList);
});


app.post('/api/chats/:id/messages', (req, res) => {
  const chatId = parseInt(req.params.id);
  const { text } = req.body;
  
  console.log(`📨 Получено сообщение для чата ${chatId}: "${text}"`);
  
  const updatedChats = addMessageToChat(chatId, text);
  res.json({ success: true, chats: updatedChats });
});


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
    return res.status(401).json(result); // 401 - Unauthorized
  }
  
  res.json(result);
});


app.get('/api/check-auth', (req, res) => {
  // Получаем токен из заголовка Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      authenticated: false,
      error: 'Токен отсутствует'
    });
  }
  
  const token = authHeader.substring(7); // Убираем "Bearer "
  const verification = verifyToken(token);
  
  if (!verification.valid) {
    return res.status(401).json({
      authenticated: false,
      error: verification.error
    });
  }
  
  res.json({
    authenticated: true,
    user: verification.user
  });
});

app.get('/api/debug/users', (req, res) => {
  const users = getAllUsers();
  res.json({ users });
});

app.post('/api/chats/:id/voice-upload', upload.single('voice'), (req, res) => {
  const chatId = parseInt(req.params.id);
  const file = req.file;
  const { duration } = req.body;

  if (!file) {
    return res.status(400).json({ error: 'Файл не загружен' });
  }

  console.log(`📥 Загружен файл голосового сообщения: ${file.filename}`);

  const fileUrl = `/uploads/voice/${file.filename}`;

  const updatedChats = addMyVoiceMessageToChat(chatId, {
    file: fileUrl,
    duration: Number(duration),
  });

  res.json({ success: true, chats: updatedChats });
});

app.use('/uploads', express.static('uploads'));



app.delete('/api/chats/:id/messages', (req, res) => {
  const chatId = parseInt(req.params.id);
  const { messageId } = req.body;

  console.log(`📨 Получен запрос на удаление сообщения ${messageId} из чата ${chatId}`);
  
  const updatedChats = deleteMessageFromChat(chatId, messageId);
  res.json({ success: true, chats: updatedChats });
});


app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log('📡 Доступные эндпоинты:');
  console.log('   GET  http://localhost:3001/api/chats');
  console.log('   GET  http://localhost:3001/api/chats-list'); 
  console.log('   POST http://localhost:3001/api/chats/0/messages');
});


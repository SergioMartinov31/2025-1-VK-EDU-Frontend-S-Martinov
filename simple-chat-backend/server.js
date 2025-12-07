import express from 'express'; //Обрабатывает HTTP запросы (GET, POST, PUT, DELETE)
import cors from 'cors'; // (Cross-Origin Resource Sharing) - разрешает запросы между разными доменами
import { getChats, getChatsList, addMessageToChat, deleteMessageFromChat} from './data/chats.js';

const app = express(); 
const PORT = 3001;

// ⭐ MIDDLEWARE - обязательные штуки
app.use(cors()); // Разрешаем запросы с фронтенда
app.use(express.json()); // Позволяем читать JSON из тела запроса

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
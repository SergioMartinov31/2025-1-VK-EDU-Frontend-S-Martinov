import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my-super-secret-key-change-in-production';


const users = [];
const chats = [];

let userIdCounter = 1;
let chatIdCounter = 0;

const getCurrTime = () => new Date().toLocaleTimeString()

const createTestUsers = async () => {
  if (users.length === 0) {
    console.log('🟡 Создаю тестовых пользователей...');
    
    const testUsers = [
      { username: "shrek", password: "123456", avatar: "/avatars/avatar1.png" },
      { username: "donkey", password: "123456", avatar: "/avatars/avatar1.png" },
      { username: "swamp", password: "123456", avatar: "/avatars/avatar1.png" },
      { username: "fiona", password: "123456", avatar: "/avatars/avatar2.png" }
    ];
    
    for (const userData of testUsers) {
      const passwordHash = await bcrypt.hash(userData.password, 10);
      
      const user = {
        id: userIdCounter++,
        username: userData.username,
        passwordHash,
        avatar: userData.avatar,
        createdAt: new Date()
      };
      
      users.push(user);
    }
    
    console.log(`✅ Создано ${users.length} тестовых пользователя`);
    
    // Автоматически создаем чаты между всеми пользователями
    createChatsBetweenAllUsers();
  }
};


// Функция создает чаты между всеми пользователями
const createChatsBetweenAllUsers = () => {
  console.log('🔄 Создаю чаты между всеми пользователями...');
  
  // Для каждой уникальной пары пользователей
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const user1 = users[i];
      const user2 = users[j];
      
      // Создаем чат
      const newChat = {
        id: chatIdCounter++,
        participants: [user1.id, user2.id], // КТО в чате
        messages: [] // начинаем с пустых сообщений
      };
      
      chats.push(newChat);
      console.log(`✅ Создан чат между ${user1.username} и ${user2.username} (ID: ${newChat.id})`);
    }
  }
  
  console.log(`✅ Всего создано ${chats.length} чатов`);
};

// Запускаем создание тестовых данных
// createTestUsers();


export const registerUser = async (username, password) => {
  try {
    console.log(`🔐 Попытка регистрации: ${username}`);
    
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return {
        success: false,
        error: 'Пользователь с таким именем уже существует'
      };
    }
    
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    const user = {
      id: userIdCounter++,
      username: username,
      passwordHash: passwordHash,
      avatar: `/avatars/avatar${(userIdCounter % 2) + 1}.png`,
      createdAt: new Date()
    };
    
    const existingUsers = [...users];
    
    users.push(user);
    console.log(`пользователь зареган: ${username} (ID: ${user.id})`);
    

    existingUsers.forEach(existingUser => {
      const newChat = {
        id: chatIdCounter++,
        participants: [user.id, existingUser.id],
        messages: []
      };
      
      chats.push(newChat);
      console.log(`✅ Создан чат между ${username} и ${existingUser.username}`);
    });
    // ======================================
    
    // Создаём JWT токен
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return {
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    };
    
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    return {
      success: false,
      error: 'Ошибка сервера при регистрации'
    };
  }
};

export const loginUser = async (username, password) => {
  try {
    console.log(`🔐 Попытка входа: ${username}`);
    
    // Ищем пользователя
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }
    
    // Сравниваем пароль с хешем
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Неверный пароль'
      };
    }
    
    // Создаём JWT токен
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log(`✅ Успешный вход: ${username} (ID: ${user.id})`);
    
    return {
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    };
    
  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    return {
      success: false,
      error: 'Ошибка сервера при входе'
    };
  }
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      user: decoded
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};


export const getAllUsers = () => {
  return users.map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    createdAt: user.createdAt
  }));
};

export const getUserById = (userId) => {
  return users.find(u => u.id === userId) || null;
};

const getChats = (userId) => {
  // Находим чаты где есть этот пользователь
  const userChats = chats.filter(chat => chat.participants.includes(userId));
  
  // Преобразуем в формат для фронтенда
  return userChats.map(chat => {
    // Находим собеседника
    const partnerId = chat.participants.find(id => id !== userId);
    const partner = users.find(u => u.id === partnerId);
    
    // Форматируем сообщения
    const formattedMessages = (chat.messages || []).map(msg => ({
      isOurs: msg.userId === userId, // Наше ли сообщение?
      text: msg.text,
      voiceMessageObj: msg.voiceMessageObj || null,
      time: msg.time || getCurrTime()
    }));
    
    // Возвращаем в формате, который ожидает фронтенд
    return {
      id: chat.id,
      name: partner ? partner.username : 'Unknown',
      avatar: partner ? partner.avatar : '/avatars/default.png',
      unreadMessages: chat.unreadMessages || 0,
      messages: formattedMessages
    };
  });
};

const getChatsList = (userId) => {
  const userChats = getChats(userId);
  
  return userChats.map(chat => ({
    id: chat.id,
    name: chat.name,
    avatar: chat.avatar,
    unreadMessages: chat.unreadMessages,
    lastMessage: chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1]
      : { text: 'Нет сообщений', time: '00:00', isOurs: false }
  }));
};

const getChatById = (chatId, userId) => {
  const chat = chats.find(c => c.id === chatId);
  
  // Проверяем, есть ли пользователь в этом чате
  if (!chat || !chat.participants.includes(userId)) {
    return null;
  }
  
  return chat;
};

// ==================== ФУНКЦИИ ДЛЯ СООБЩЕНИЙ ====================

// Добавить текстовое сообщение
const addMessageToChat = (chatId, userId, text) => {
  const chat = getChatById(chatId, userId);
  
  if (!chat) {
    console.log(`❌ Пользователь ${userId} не имеет доступа к чату ${chatId}`);
    return null;
  }
  
  const newMessage = {
    userId: userId, // КТО отправил
    text: text,
    time: getCurrTime()
  };
  
  // Инициализируем messages если пусто
  if (!chat.messages) chat.messages = [];
  
  // Добавляем сообщение
  chat.messages.push(newMessage);
  
  // Увеличиваем счетчик непрочитанных у собеседника
  const partnerId = chat.participants.find(id => id !== userId);
  // TODO: позже добавим логику для непрочитанных
  
  console.log(`✅ Сообщение добавлено в чат ${chatId} от пользователя ${userId}: "${text}"`);
  
  return {
    isOurs: true,
    text: text,
    time: newMessage.time
  };
};

// Добавить голосовое сообщение
const addMyVoiceMessageToChat = (chatId, userId, voiceData) => {
  const chat = getChatById(chatId, userId);
  
  if (!chat) {
    console.log(`❌ Пользователь ${userId} не имеет доступа к чату ${chatId}`);
    return null;
  }
  
  const newMessage = {
    userId: userId,
    text: "[Голосовое сообщение]",
    voiceMessageObj: {
      voice_text: voiceData.file,
      duration: voiceData.duration,
      mime: voiceData.mime || 'audio/webm'
    },
    time: getCurrTime()
  };
  
  if (!chat.messages) chat.messages = [];
  chat.messages.push(newMessage);
  
  console.log(`🎤 Голосовое сообщение добавлено в чат ${chatId} от пользователя ${userId}`);
  
  return {
    isOurs: true,
    text: newMessage.text,
    voiceMessageObj: newMessage.voiceMessageObj,
    time: newMessage.time
  };
};

// Удалить сообщение
const deleteMessageFromChat = (chatId, messageId, userId) => {
  const chat = getChatById(chatId, userId);
  
  if (!chat || !chat.messages) {
    return false;
  }
  
  // Удаляем сообщение по индексу
  const messageIndex = chat.messages.findIndex((msg, index) => index === messageId);
  
  if (messageIndex === -1) {
    return false;
  }
  
  // Проверяем, что сообщение принадлежит пользователю
  if (chat.messages[messageIndex].userId !== userId) {
    return false;
  }
  
  chat.messages.splice(messageIndex, 1);
  console.log(`✅ Сообщение ${messageId} удалено из чата ${chatId}`);
  
  return true;
};

const resetChats = () => {
  // Очищаем чаты
  chats.length = 0;
  chatIdCounter = 0;
  
  // Создаем заново
  createChatsBetweenAllUsers();
  
  console.log('🔄 Чаты сброшены и созданы заново');
  return getChats(1); // возвращаем чаты первого пользователя для теста
};

export {
  getChats,
  getChatsList,
  addMessageToChat,
  addMyVoiceMessageToChat,
  deleteMessageFromChat,
  resetChats,
};
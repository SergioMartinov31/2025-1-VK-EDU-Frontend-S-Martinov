import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my-super-secret-key-change-in-production';


const users = [];

let userIdCounter = 1;

const getCurrTime = () => new Date().toLocaleTimeString()

// Начальные данные для чатов
const initialChats = [
  {
    id: 0,
    name: 'Shrek',
    avatar: 'https://avatar.iran.liara.run/public/boy',
    unreadMessages: 99,
    messages: [
      {
        isOurs: false,
        text: 'hello1!jhgjhjh',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello2!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello3!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello4!',
        time: getCurrTime(),
      },
    ]
  },
  {
    id: 1,
    name: 'Donkey',
    avatar: 'https://avatar.iran.liara.run/public/boy',
    unreadMessages: 99,
    messages: [
      {
        isOurs: false,
        text: 'hello5!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello6!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello7!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello8!',
        time: getCurrTime(),
      },
    ]
  },
  {
    id: 2,
    name: 'Swamp',
    avatar: 'https://avatar.iran.liara.run/public/boy',
    unreadMessages: 228,
    messages: [
      {
        isOurs: false,
        text: 'hello!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello!',
        time: getCurrTime(),
      },
    ]
  },
  {
    id: 3,
    name: 'Fiona',
    avatar: 'https://avatar.iran.liara.run/public/girl',
    unreadMessages: 0,
    messages: [
      {
        isOurs: false,
        text: 'hello!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello!',
        time: getCurrTime(),
      },
      {
        isOurs: true,
        text: 'hello!',
        time: getCurrTime(),
      },
    ]
  },
]


let chats = [...initialChats];


export const registerUser = async (username, password) => {
  try {
    console.log(`🔐 Попытка регистрации: ${username}`);
    
    // Проверяем, существует ли пользователь
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return {
        success: false,
        error: 'Пользователь с таким именем уже существует'
      };
    }
    
    // Хешируем пароль
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Создаём пользователя
    const user = {
      id: userIdCounter++,
      username: username,
      passwordHash: passwordHash,
      createdAt: new Date()
    };
    
    users.push(user);
    console.log(`✅ Зарегистрирован пользователь: ${username} (ID: ${user.id})`);
    
    // Создаём JWT токен
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Токен живёт 24 часа
    );
    
    return {
      success: true,
      token: token,
      user: {
        id: user.id,
        username: user.username
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
        username: user.username
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
    createdAt: user.createdAt
  }));
};

export const getUserById = (userId) => {
  return users.find(u => u.id === userId) || null;
};


const getToken = (username, password) => {
  if(!tokensList[username]){
    //надо вывести на фронт сообщение пользователю что пользователя с таким ником нет
  } else{
    // дальше надо проверить пароль наверное либо я в целом не очень понимаю как устроить этот объект с токенами 
  }
}

const createToken = (username, password) => {
  if(!tokensList[username]){
    tokensList[username] = password;
  } else{
    //надо на фронт как-то передать ошибку что юзер с таким именем уже есть
  }
}


const getChats = () => {
  // console.log('это я', chats)
  return chats;
};

const getChatsList = () => {
  return chats.map(chat => ({
    id: chat.id,
    name: chat.name,
    avatar: chat.avatar,
    unreadMessages: chat.unreadMessages,
    lastMessage: chat.messages.length > 0 
      ? chat.messages[chat.messages.length - 1]
      : { text: 'Нет сообщений', time: '00:00', isOurs: false }
  }));
};

// Добавить сообщение в чат
const addMessageToChat = (id, text) => {
  const chat = chats.find(chatItem => chatItem.id === id);
  
  if (chat) {
    chat.messages.push({
      isOurs: true,
      text,
      time: getCurrTime(),
    });

    chat.unreadMessages += 1;

    // Сохраняем обратно в localStorage
    console.log(`✅ Сообщение добавлено в чат ${id}: "${text}"`);
  }
  
  return getChats(); // Возвращаем обновленные данные
};

const addMyVoiceMessageToChat = (id, voiceData) => {
  const chat = chats.find(chatItem => chatItem.id === id);
  
  if (chat) {
    chat.messages.push({
      isOurs: true,
      type: "voice", // Добавляем тип для фильтрации
      text: "[Голосовое сообщение]",
      // Выносим voiceMessageObj на верхний уровень:
      voiceMessageObj: {  
        voice_text: voiceData.file,       // URL файла
        duration: voiceData.duration,
        mime: voiceData.mime || 'audio/webm'
      },
      time: getCurrTime(),
    });

    chat.unreadMessages += 1;
    console.log(`🎤 Голосовое сообщение сохранено: ${voiceData.file}`);
  }
  
  return getChats();
};


const deleteMessageFromChat = (id, messageId) => {
  const chat = chats.find(chatItem => chatItem.id === id);
  
  if (chat) {
    chat.messages = chat.messages.filter((msg, index) => index !== messageId);

    console.log(`✅ Сообщение с id ${messageId} удалено из чата ${id}`);
  }
  
  return getChats(); 
}

const resetChats = () => {
  chats = [...initialChats];
  return getChats();
};

export {
  getChats,
  getChatsList, 
  addMessageToChat,
  addMyVoiceMessageToChat,
  deleteMessageFromChat,
  resetChats,
  getToken,
  createToken
};
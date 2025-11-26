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

// Получить чаты
const getChats = () => {
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

const resetChats = () => {
  chats = [...initialChats];
  return getChats();
};

export {
  getChats,
  getChatsList, 
  addMessageToChat,
  resetChats
};
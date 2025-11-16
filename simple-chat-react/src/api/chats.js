const getCurrTime = () => new Date().toLocaleTimeString()

// Начальные данные для чатов
export const initialChats = [
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

// Получить чаты из localStorage или начальные данные
export const getChats = () => {
  const storedChats = localStorage.getItem('chats');
  if (storedChats) {
    console.log(JSON.parse(storedChats));
    return JSON.parse(storedChats);
  }
  // Если в localStorage пусто, сохраняем начальные данные
  localStorage.setItem('chats', JSON.stringify(initialChats));
  return initialChats;
};

// Добавить сообщение в чат
export const addMyMessageToChat = (id, text) => {
  const chats = getChats(); // Читаем текущие данные
  const chat = chats.find(chatItem => chatItem.id === id);
  
  if (chat) {
    chat.messages.push({
      isOurs: true,
      text,
      time: getCurrTime(),
    });

    // Обновляем unreadMessages (можно добавить логику)
    // chat.unreadMessages += 1;

    // Сохраняем обратно в localStorage
    localStorage.setItem('chats', JSON.stringify(chats));
  }
  
  return getChats(); // Возвращаем обновленные данные
};


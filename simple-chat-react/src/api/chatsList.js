const getCurrTime = () => new Date().toLocaleTimeString()

export const chatsList = [
  {
    id: 0,
    name: 'Shrek',
    type: 'pm',
    unreadMessages: 99,
    hasMentions: false,
    lastMessage: {
      text: 'Azaza, ya tibya zatrallil)))00)0)nulik))00',
      isOurs: true,
      isRead: true,
      attachment: {
        type: 'image',
        src: 'https://otvet.cdn-vk.net/pictures/logo.svg',
      },
      time: getCurrTime(),
    },
    avatar: 'https://avatar.iran.liara.run/public/boy',
  },
  {
    id: 1,
    name: 'Donkey',
    type: 'pm',
    unreadMessages: 99,
    hasMentions: true,
    lastMessage: {
      text: 'А я осёл!',
      isOurs: true,
      isRead: true,
      attachment: {
        type: 'image',
        src: 'https://otvet.cdn-vk.net/pictures/logo.svg',
      },
      time: getCurrTime(),
    },
    avatar: 'https://avatar.iran.liara.run/public/boy',
  },
  {
    id: 2,
    name: 'Swamp',
    type: 'chat',
    unreadMessages: 228,
    hasMentions: true,
    lastMessage: {
      text: 'Осёл, куда делась моя еда?',
      isOurs: false,
      isRead: true,
      time: getCurrTime(),
    },
    avatar: 'https://avatar.iran.liara.run/public/boy',
  },
  {
    id: 3,
    name: 'Fiona',
    type: 'pm',
    unreadMessages: 0,
    hasMentions: false,
    lastMessage: {
      text: 'Прости, сегодня не приду ((',
      isOurs: false,
      isRead: true,
      time: getCurrTime(),
    },
    avatar: 'https://avatar.iran.liara.run/public/girl',
  },
]

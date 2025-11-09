import { chatsList } from './chatsList';

let lsChats = localStorage.getItem('chats')
if (lsChats) {
  lsChats = JSON.parse(lsChats);
}

const getCurrTime = () => new Date().toLocaleTimeString()

export const chats = lsChats || [
  {
    id: 0,
    messages: [
      {
        isOurs: false,
        text: 'hello1!',
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
].map(chat => {
  return {
    ...chat,
    name: chatsList.find(chatListItem => chatListItem.id === chat.id ).name
  }
})

export const addMyMessageToChat = (id, text) => {
  const chat = chats.find(chatItem => chatItem.id === id);
  chat.messages.push({
    isOurs: true,
    text,
    time: getCurrTime(),
  })

  localStorage.setItem('chats', JSON.stringify(chats));
}

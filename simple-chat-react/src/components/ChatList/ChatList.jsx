import { ChatListItem } from "../ChatListItem/ChatListItem"

import { Link } from 'react-router-dom'
import './ChatList.scss'

export const ChatList = ({ ChatsLog}) => {
  const ListEl = ChatsLog.map((chat) => (
    <Link
      key={chat.id}
      to={`/chat/${chat.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
    <ChatListItem 
      id={chat.id}
      name={chat.name}
      avatar={chat.avatar}
      messages={chat.messages} // ← передаем весь массив сообщений
      unreadMessages={chat.unreadMessages}
    />
    </Link>
  ))
  
  return (
    <ul className="ChatList">
      {ListEl}
    </ul>
  )
}
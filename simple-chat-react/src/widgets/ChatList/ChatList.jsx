import { ChatListItem } from "../../entities/сhat/ChatListItem"
import { useParams } from 'react-router-dom';

import { Link } from 'react-router-dom'
import './ChatList.scss'

export const ChatList = ({ ChatsLog}) => {

    if (!ChatsLog || !Array.isArray(ChatsLog)) {
    return (
      <ul className="ChatList">
        <li style={{ padding: '20px', textAlign: 'center' }}>
          Загрузка чатов...
        </li>
      </ul>
    );
  }

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
      messages={chat.messages} 
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
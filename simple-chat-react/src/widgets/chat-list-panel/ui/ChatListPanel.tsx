import { Link } from 'react-router-dom';
import type { Chat } from '../../../entities/chat';
import { ChatListItem } from '../../../entities/chat';
import './ChatListPanel.scss';

interface ChatListPanelProps {
  ChatsLog: Chat[];
}

export const ChatListPanel = ({ ChatsLog }: ChatListPanelProps) => {
  if (!ChatsLog || !Array.isArray(ChatsLog)) {
    return (
      <ul className='ChatList'>
        <li style={{ padding: '20px', textAlign: 'center' }}>Загрузка чатов...</li>
      </ul>
    );
  }

  return (
    <ul className='ChatList'>
      {ChatsLog.map((chat) => (
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
      ))}
    </ul>
  );
};

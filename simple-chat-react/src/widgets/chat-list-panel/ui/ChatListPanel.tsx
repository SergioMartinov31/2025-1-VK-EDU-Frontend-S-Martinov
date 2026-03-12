import { useGetChatsQuery } from '../../../entities/chat/api/chatApi';
import { Link } from 'react-router-dom';
import type { Chat } from '../../../entities/chat';
import { ChatListItem } from '../../../entities/chat';
import './ChatListPanel.scss';


export const ChatListPanel = () => {
  const { data: chats = [], isLoading, isError, error, isFetching } = useGetChatsQuery(undefined);

    if (isLoading) {
    return (
      <ul className="ChatList">
        <li style={{ padding: '20px', textAlign: 'center' }}>Загрузка чатов...</li>
      </ul>
    );
  }

  if (isError) {
    return (
      <ul className="ChatList">
        <li style={{ padding: '20px', textAlign: 'center' }}>
          Ошибка загрузки
        </li>
      </ul>
    );
  }


  if (chats.length === 0) {
    return (
      <ul className="ChatList">
        <li style={{ padding: '20px', textAlign: 'center' }}>Чатов пока нет</li>
      </ul>
    );
  }


  return (
    <ul className='ChatList'>
      {chats.map((chat) => (
        <Link
          key={chat.id}
          to={`/chat/${chat.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ChatListItem
            id={chat.id}
            partnerId={chat.partnerId}
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

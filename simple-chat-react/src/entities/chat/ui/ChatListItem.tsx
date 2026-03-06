import './ChatListItem.scss';
import { useParams } from 'react-router-dom';
import { config } from '../../../shared/config';
import { OnlineDot } from '../../../features/online';

import type { Message } from '../../message';

interface ChatListItemProps {
  id: number;
  partnerId?: number | null;
  name: string;
  avatar: string;
  messages: Message[];
  unreadMessages: number;
}

export const ChatListItem = ({id, partnerId, name, avatar, messages, unreadMessages}: ChatListItemProps) => {
  const { chatId } = useParams();
  let isActive = parseInt(chatId, 10) === id;
  const lastMessage = messages && messages.length > 0 
    ? messages[messages.length - 1] 
    : { text: 'Нет сообщений', time: '00:00', isOurs: false };
  
  const NormalTime = lastMessage.time ? lastMessage.time.slice(0,5) : '00:00';

  return (
    <li className={`list-item ${isActive ? 'list-item--active' : ''}`}>
      <div className='list-item__avatarWrap'>
        <img className="list-item__img" src={`${config.API_URL}${avatar}`} width="100" height="100" alt={name}/>
        <div className='list-item__onlineDot'>
          <OnlineDot userId={partnerId} size={12} />
        </div>
      </div>
      <div className="list-item__info">
        <div className="middle-container">
          <span className="name">{name}</span>
          <span className="last-msg">{lastMessage.text}</span>
        </div>
        <div className="end-container">
          <span className="time-msg">{NormalTime}</span>
          {unreadMessages > 0 && (
            <div className="msg-counter">
              <span className="msg-counter__text">{unreadMessages}</span>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

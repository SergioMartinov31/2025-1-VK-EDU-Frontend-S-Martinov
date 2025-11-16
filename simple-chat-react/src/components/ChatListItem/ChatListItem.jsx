import '../ChatListItem/ChatListItem.scss'

export const ChatListItem = ({id, name, avatar, messages, unreadMessages}) => {
  const lastMessage = messages && messages.length > 0 
    ? messages[messages.length - 1] 
    : { text: 'Нет сообщений', time: '00:00', isOurs: false };
  
  const NormalTime = lastMessage.time ? lastMessage.time.slice(0,5) : '00:00';

  return (
    <li className="list-item">
      <img className="list-item__img" src={avatar} width="100" height="100" alt={name}/>
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
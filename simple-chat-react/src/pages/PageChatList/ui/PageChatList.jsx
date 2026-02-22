import { ChatListPanel } from '../../../widgets/chat-list-panel';
import { logout } from '../../../features/logout';
import { config } from '../../../shared/config';
import './PageChatList.scss';

export const PageChatList = ({ ChatsLog, currentUser, setIsAuthenticated, setCurrentUser }) => {
  const handleLogout = () => {
    logout({ setIsAuthenticated, setCurrentUser });
  };

  return (
    <div className='PageChatList-container'>
      {currentUser && (
        <div className='PageChatList-header'>
          <div className='PageChatList-header__userInfo'>
            <img src={`${config.API_URL}${currentUser.avatar}`} alt='Аватар' className='user-avatar' />
            <span className='PageChatList__username'>{currentUser.username}</span>
          </div>
          <button className='logout-btn' onClick={handleLogout}>
            Выйти
          </button>
        </div>
      )}
      <ChatListPanel ChatsLog={ChatsLog} />
    </div>
  );
};

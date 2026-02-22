import {ChatList} from '../../widgets/ChatList'
import {logout } from '../../features/logout'
import './PageChatList.scss'
import { config } from '../../shared/config/config';


export const PageChatList = ({ ChatsLog, currentUser,setIsAuthenticated, setCurrentUser}) => {
  const handleLogout = () => {
    logout(setIsAuthenticated, setCurrentUser);
  };

  return (
    <div className='PageChatList-container'>
        {currentUser && (
        <div className='PageChatList-header'>
        <div className='PageChatList-header__userInfo'>
          <img  src={`${config.API_URL}${currentUser.avatar}`} alt="Аватар" className="user-avatar" />
          <span className='PageChatList__username'>{currentUser.username}</span>
        </div>
        <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Выйти
        </button>
        </div>

      )}
    <ChatList ChatsLog = {ChatsLog} ></ChatList>
  </div>
  )
}
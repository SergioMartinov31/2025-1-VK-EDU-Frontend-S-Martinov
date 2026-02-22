import { useParams } from 'react-router-dom';

import { config } from '../../../shared/config';
import './ChatProfilePanel.scss';

export const ChatProfilePanel = ({ selectChatAPI, showProfile, setShowProfile }) => {
  const { chatId } = useParams();
  const id = parseInt(chatId, 10);

  if (!selectChatAPI) {
    return null;
  }

  const activeChatData = selectChatAPI.find((chat) => chat.id === id);

  return (
    <div className={showProfile ? 'Chat-Profile-active' : 'Chat-Profile'}>
      <div className='Chat-Profile__header'>
        <button className='Chat-Profile__closeButton' onClick={() => setShowProfile(false)}>
          X
        </button>
        <h2 className='Chat-Profile__title'>Информация</h2>
      </div>
      {activeChatData && (
        <div className='Chat-Profile__info'>
          <img
            className='Chat-Profile__avatar'
            src={`${config.API_URL}${activeChatData.avatar}`}
            alt={activeChatData.name}
            width='160'
            height='160'
          />
          <span className='Chat-Profile__name'>{activeChatData.name}</span>
        </div>
      )}
    </div>
  );
};

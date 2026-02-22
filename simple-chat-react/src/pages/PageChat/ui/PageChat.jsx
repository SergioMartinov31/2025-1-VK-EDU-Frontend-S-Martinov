import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { Message } from '../../../entities/message';
import { ChatInput, sendMessage } from '../../../features/send-message';
import { deleteMessage } from '../../../features/delete-message';
import { config } from '../../../shared/config';
import './PageChat.scss';

export const PageChat = ({ selectChatAPI, setChats, setShowProfile }) => {
  const { chatId } = useParams();
  const id = parseInt(chatId, 10);

  const activeChatData = selectChatAPI?.find((chat) => chat.id === id);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeChatData?.messages, id]);

  const handleSendMessage = (messageObj) => {
    sendMessage({ chatId: id, messageObj, setChats });
  };

  const handleDeleteMessage = (messageId) => {
    deleteMessage({ chatId: id, messageId, setChats });
  };

  const openProfile = () => {
    setShowProfile(true);
  };

  const onVideoClick = () => {
    console.log('onVideo');
  };

  if (!selectChatAPI) {
    return (
      <div className='Chat-container'>
        <h2 className='Chat-container__selectTitle'>Загрузка чата...</h2>
      </div>
    );
  }

  if (!activeChatData) {
    return (
      <div className='Chat-container'>
        <h2 className='Chat-container__selectTitle'>Выберите чат слева</h2>
      </div>
    );
  }

  return (
    <div className='Chat-container'>
      <div className='Chat-container__header' onClick={openProfile}>
        <img
          src={`${config.API_URL}${activeChatData.avatar}`}
          alt='Аватар чата'
          className='chat-avatar'
        />
        <h2 className='Chat-container__chatTitle'>{activeChatData.name}</h2>
      </div>

      <div className='scroll-container' ref={messagesContainerRef}>
        {activeChatData.messages.length === 0 ? (
          <h2 className='Chat-container__selectTitle'>Нет сообщений</h2>
        ) : (
          activeChatData.messages.map((message, index) => (
            <li key={index}>
              <Message
                isOurs={message.isOurs}
                text={message.text}
                voiceMessageObj={message.voiceMessageObj || null}
                time={message.time}
                messageId={index}
                deleteMessage={handleDeleteMessage}
              />
            </li>
          ))
        )}
      </div>

      <ChatInput
        SendMessage={handleSendMessage}
        currentChatId={id}
        setChats={setChats}
        onVideoClick={onVideoClick}
      />
    </div>
  );
};

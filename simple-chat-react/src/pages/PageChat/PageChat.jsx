import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '../../entities/message/Message';
import { ChatInput } from '../../features/send-message/ui/ChatInput';
import {deleteMessage} from '../../features/delete-message';
import {sendMessage} from '../../features/send-message';
import './PageChat.scss';
import { config } from '../../shared/config/config';

export const PageChat = ({ selectChatAPI, setChats, setShowProfile }) => {
  const { chatId } = useParams();
  const id = parseInt(chatId, 10);

  const activeChatData = selectChatAPI?.find(chat => chat.id === id);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleSendMessage = (messageObj) => {
    sendMessage(id, messageObj, setChats);
  }

  const hendleDeleteMessage = (messageId) => {
    deleteMessage(id, messageId, setChats);
  }

  const onVideoClick = () => {
    console.log('onVideo');
  }

  const openProfile = () => {
    setShowProfile(true);
    console.log('openProfile');
  }

  if (!selectChatAPI) {
    return <div className='Chat-container'>
      <h2 className='Chat-container__selectTitle'>Загрузка чата...</h2>
    </div>;
  }

  useEffect(() => {
    scrollToBottom();
  }, [activeChatData?.messages, id]);


  if (!activeChatData) {
    return (
      <div className='Chat-container'>
        <h2 className='Chat-container__selectTitle'>Выберите чат слева</h2>
      </div>
    );
  }

  const MessageList = activeChatData.messages.map((message, index) => (
    <li key={index}>
      <Message 
        isOurs={message.isOurs} 
        text={message.text} 
        voiceMessageObj={message.voiceMessageObj || null} 
        time={message.time} 
        messageId={index} 
        deleteMessage={hendleDeleteMessage}
      />
    </li>
  ));

  return (
    <>
    <div className='Chat-container'>
      <div className='Chat-container__header' onClick={openProfile}>
        <img 
          src={`${config.API_URL}${activeChatData.avatar}`}
          alt="Аватар чата" 
          className="chat-avatar" 
        />
        <h2 className='Chat-container__chatTitle'>{activeChatData.name}</h2>
      </div>
      <div className="scroll-container" ref={messagesContainerRef}>
        {activeChatData.messages.length === 0 ? (
          <h2 className='Chat-container__selectTitle'>Нет сообщений</h2>
        ) : MessageList}
      </div>
      <ChatInput SendMessage={handleSendMessage} currentChatId={id} setChats={setChats} onVideoClick={onVideoClick} />
    </div>
    </>
  );
};
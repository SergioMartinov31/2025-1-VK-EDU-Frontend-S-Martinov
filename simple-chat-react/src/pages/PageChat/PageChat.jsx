// PageChat.jsx - УПРОЩАЕМ
import { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '../../components/Message/Message';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import { addMyMessageToChat, deleteMessageFromChat } from '../../api/chatsAPI.js';
import './PageChat.scss';

export const PageChat = ({ selectChatAPI, setChats }) => {
  const { chatId } = useParams();
  const id = parseInt(chatId, 10);
  const activeChatData = selectChatAPI.find(chat => chat.id === id);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const updatedChats = await deleteMessageFromChat(id, messageId);
      setChats(updatedChats.chats); 
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatData?.messages, id]);

  // Упрощаем SendMessage - теперь только для текста
  const SendMessage = async (messageObj) => {
    if (messageObj.type === "text") {
      try {
        const updatedChats = await addMyMessageToChat(id, messageObj.text);
        setChats(updatedChats.chats);
      } catch (error) {
        console.error('Ошибка отправки:', error);
      }
    }
    // Голосовые сообщения теперь обрабатываются в VoiceInput
  };

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
        deleteMessage={deleteMessage}
      />
    </li>
  ));

  const onVideoClick = () => {
    console.log('onVideo');
  }

  return (
    <div className='Chat-container'>
      <div className="scroll-container" ref={messagesContainerRef}>
        {activeChatData.messages.length === 0 ? (
          <h2 className='Chat-container__selectTitle'>Нет сообщений</h2>
        ) : MessageList}
      </div>
      <ChatInput SendMessage={SendMessage} currentChatId={id} setChats={setChats} onVideoClick={onVideoClick} />
      
    </div>
  );
};
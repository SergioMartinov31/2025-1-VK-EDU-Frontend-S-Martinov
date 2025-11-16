import { useRef, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

import {Message} from '../../components/Message/Message';
import { ChatInput } from '../../components/ChatInput/ChatInput';
import {addMyMessageToChat, getChats} from '../../api/chats.js'
import './PageChat.scss';


export const PageChat = ({selectChatAPI, setChats}) => {
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

  useEffect(() => {
    scrollToBottom();
  }, [activeChatData?.messages, chatId]);



  const SendMessage = (messageText) => {
    const updatedChats = addMyMessageToChat(id, messageText);
    setChats(updatedChats);
  }

  if (!activeChatData) {
    return (
      <div className='Chat-container'>
        <h2 className='Chat-container__selectTitle'>Выберите чат слева</h2>
      </div>
    );
  }
  else {
  const MessageList = activeChatData.messages.map((message, index) => (
      <li 
      key={index}>
        <Message isOurs={message.isOurs} text={message.text} time={message.time}></Message>
      </li>
    )
  );


  return (
    <ul className='Chat-container' >
      <div className="scroll-container" ref={messagesContainerRef}>
      {MessageList}
      </div>
      <ChatInput SendMessage={SendMessage}></ChatInput>
    </ul>
  );
  }
}
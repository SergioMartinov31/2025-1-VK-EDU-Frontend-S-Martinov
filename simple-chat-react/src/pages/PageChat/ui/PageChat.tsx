import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import type {Chat} from '../../../entities/chat';
import type { User } from '../../../entities/user';
import type { MessageInput } from '../../../features/send-message/model/types';
import { MessageComponent } from '../../../entities/message';
import { ChatInput, sendMessage } from '../../../features/send-message';
import { deleteMessage } from '../../../features/delete-message';
import { OnlineDot } from '../../../features/online';
import { config } from '../../../shared/config';
import { FaceTimeButton } from '../../../features/face-time';
import './PageChat.scss';

import { useDispatch } from 'react-redux'
import { openPartnerProfile } from '../../../features/show-partner-profile/profileSlice'




interface PageChatProps {
  selectChatAPI: Chat[];
  currentUser: User | null;
  setChats: (chats: Chat[]) => void;
}

export const PageChat = ({ selectChatAPI, currentUser, setChats}: PageChatProps) => {

  const dispatch = useDispatch()


  const { chatId } = useParams<{ chatId: string }>();
  const id = Number(chatId);

  const activeChatData = selectChatAPI?.find((chat) => chat.id === id);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeChatData?.messages, id]);

  const handleSendMessage = (messageObj: MessageInput): void => {
    void sendMessage({ chatId: id, messageObj, setChats });
  };

  const handleDeleteMessage = (messageId: number): void => {
    void deleteMessage({ chatId: id, messageId, setChats });
  };

  const openProfile = (): void => {
    // setShowProfile(true);
    dispatch(openPartnerProfile())
  };

  const onVideoClick = (): void => {
    console.log('onVideo');
  };


  if (!Number.isFinite(id) || !selectChatAPI) {
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
        <div>
        <div className='chat-avatar-wrap'>
          <img
            src={`${config.API_URL}${activeChatData.avatar}`}
            alt='Аватар чата'
            className='chat-avatar'
          />
          <div className='chat-avatar-online'>
            <OnlineDot userId={activeChatData.partnerId} size={12} />
          </div>
        </div>
        </div>
        <h2 className='Chat-container__chatTitle'>{activeChatData.name}</h2>
        {currentUser && activeChatData.partnerId !== null && activeChatData.partnerId !== undefined && (
          <FaceTimeButton
            currentUser={{ id: currentUser.id, username: currentUser.username }}
            targetUser={{ id: activeChatData.partnerId, username: activeChatData.name }}
          />
        )}
      </div>



      <div className='scroll-container' ref={messagesContainerRef}>
        {activeChatData.messages.length === 0 ? (
          <h2 className='Chat-container__selectTitle'>Нет сообщений</h2>
        ) : (
          activeChatData.messages.map((message, index) => (
            <li key={index}>
              <MessageComponent
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

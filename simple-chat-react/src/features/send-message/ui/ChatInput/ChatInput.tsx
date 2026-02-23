import { useState } from 'react';
import { FormEvent } from 'react';

import { VoiceInput } from '../../../send-voice-message';
import './ChatInput.scss';
import type { Chat } from '../../../../entities/chat';
import type { MessageInput } from '../../model/types';


interface ChatInputProps {
  SendMessage: (message: MessageInput) => void | Promise<void>;
  currentChatId: number;
  setChats: (chats: Chat[]) => void;
  onVideoClick: () => void;
}

export const ChatInput = ({ SendMessage, currentChatId, setChats, onVideoClick }: ChatInputProps ) => {
  const [message, setMessage] = useState('');

  const submitInput = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    SendMessage({
      type: 'text',
      text: message,
    });

    setMessage('');
  };

  return (
    <form className='Chat-form' onSubmit={submitInput}>
      <input
        className='Chat-form__input'
        type='text'
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder='Введите сообщение'
      />
      {message.trim().length > 0 ? (
        <button className='Chat-form__button' type='submit'>
          <img src='/inputBtn.svg' alt='Send text message' width='30px' height='40px' />
        </button>
      ) : (
        <VoiceInput currentChatId={currentChatId} setChats={setChats} />
      )}
      <button className='Chat-form__button' type='button' onClick={onVideoClick}>
        <img src='/video_start.svg' alt='Start record video message' width='30px' height='40px' />
      </button>
    </form>
  );
};

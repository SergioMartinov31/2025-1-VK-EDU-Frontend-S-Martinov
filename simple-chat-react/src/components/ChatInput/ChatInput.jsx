// ChatInput.jsx - УПРОЩАЕМ
import { useState } from "react";
import { VoiceInput } from '../../components/VoiceInput/VoiceInput';
import './ChatInput.scss'

export const ChatInput = ({ SendMessage, currentChatId, setChats, onVideoClick}) => { 
  const [message, setMessage] = useState('');

  const SubmitInput = (event) => {
    event.preventDefault();
    if (message.trim()) {
      SendMessage({
        type: "text",
        text: message
      });
      setMessage('');
      console.log("ADD", message);
    }
  };


  return (
    <form className="Chat-form" onSubmit={SubmitInput}>
      <input 
        className="Chat-form__input" 
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Введите сообщение"
      />
      {message.trim().length > 0 ? (
        <button className="Chat-form__button" type='submit'>
          <img src='/inputBtn.svg' alt="Send text message" width="30px" height="40px"/>
        </button>
      ) : (
        <VoiceInput currentChatId={currentChatId} setChats={setChats}/>
      )}
      <button className="Chat-form__button" onClick={onVideoClick}>
          <img src='/video_start.svg' alt="Start record video message" width="30px" height="40px"/>
      </button>
    </form>
  );
}
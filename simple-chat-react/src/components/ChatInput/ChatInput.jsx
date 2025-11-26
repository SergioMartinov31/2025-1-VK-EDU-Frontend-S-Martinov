import { useState } from "react";
import './ChatInput.scss'

export const ChatInput = ({SendMessage}) => {
   const [message, setMessage] = useState('');

    const SubmitInput = (event) => {
      event.preventDefault();
      if (message.trim()) {
      SendMessage(message); 
      setMessage('');
      console.log("ADD",message);
    }
  };
    



  return(
    <form className="Chat-form" onSubmit={SubmitInput}>
      <input 
      className="Chat-form__input" 
      type="text"
      value={message}
      onChange={(event) => setMessage(event.target.value)}
      />
      <button className="Chat-form__button" type='submit'>
        <img  src='/inputBtn.svg' alt="Send" width="40px" height="50px"/>
      </button>
    </form>
    
  );
}
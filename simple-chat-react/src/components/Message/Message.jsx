import './Message.scss'

export const Message = ({isOurs, text, time}) => {
  const NormalTime = time.slice(0,5);
  return(
    <div className={`messageContainer ${isOurs ? 'messageContainer--ours' : 'messageContainer--theirs'}`}>
      <span className="messageContainer__text">{text}</span>
      <span className="messageContainer__time">{NormalTime}</span>
    </div>
    
  )
}
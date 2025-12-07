import './Message.scss'
import { useState, useEffect, useRef} from 'react';

export const Message = ({isOurs, text, time, messageId,deleteMessage}) => {
  const [contextMenuVisible, setContextMenuVisible] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  const menuRef = useRef(null);
  const messageRef = useRef(null);

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenuVisible({
      visible: true,
      x: event.pageX,
      y: event.pageY
    });
    console.log('Context menu opened');
  }

  const handleMenuMouseLeave = () => {
    setContextMenuVisible({ visible: false, x: 0, y: 0 });
  };

  useEffect(() => {
    console.log('Context menu visibility changed:', contextMenuVisible.visible);
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)){
        setContextMenuVisible({ visible: false, x: 0, y: 0 });
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);



  


  const NormalTime = time.slice(0,5);
  return(
    <div ref={messageRef} className={`messageContainer ${isOurs ? 'messageContainer--ours' : 'messageContainer--theirs'}`} onContextMenu={handleContextMenu} onMouseLeave={handleMenuMouseLeave}>
      <span className="messageContainer__text">{text}</span>
      <span className="messageContainer__time">{NormalTime}</span>

      <div ref={menuRef} className='messageContainer__contextMenu' style={{display: contextMenuVisible.visible ? 'block' : 'none', top: contextMenuVisible.y, left: contextMenuVisible.x}}>
        <ul className='messageContainer__contextMenu-list'>
          <li className='messageContainer__contextMenu-item'>
            1. Копировать текст
          </li>
          <li className='messageContainer__contextMenu-item' onClick={() => deleteMessage(messageId)}>
            2. Удалить сообщение
          </li>
        </ul>
      </div>
    </div>
  )
}
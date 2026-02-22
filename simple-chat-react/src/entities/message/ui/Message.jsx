import './Message.scss'
import { useState, useEffect, useRef } from 'react';
import { config } from '../../../shared/config';

export const Message = ({isOurs, text, voiceMessageObj, time, messageId, deleteMessage}) => {
  const [contextMenuVisible, setContextMenuVisible] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  const menuRef = useRef(null);
  const messageRef = useRef(null);

  const isVoiceMessage = () => {
    return !!voiceMessageObj || text === "[Голосовое сообщение]";
  };

  const getAudioUrl = () => {
    if (!voiceMessageObj) {
      return '';
    }

    if (typeof voiceMessageObj === 'string') {
      const url = voiceMessageObj.startsWith('/') 
        ? `${config.API_URL}${voiceMessageObj}`
        : voiceMessageObj;
      return url;
    }
    
    if (typeof voiceMessageObj === 'object') {
      const possibleFields = ['file', 'voice_text', 'audioUrl', 'url', 'path', 'src'];
      for (const field of possibleFields) {
        if (voiceMessageObj[field]) {
          const url = voiceMessageObj[field].startsWith('/')
            ? `${config.API_URL}${voiceMessageObj[field]}`
            : voiceMessageObj[field];
          return url;
        }
      }
    }

    return '';
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenuVisible({
      visible: true,
      x: event.pageX,
      y: event.pageY
    });
  };

  const handleMenuMouseLeave = () => {
    setContextMenuVisible({ visible: false, x: 0, y: 0 });
  };

  useEffect(() => {
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

  const NormalTime = time?.slice?.(0,5) || '00:00';
  
  const isVoice = isVoiceMessage();
  const audioUrl = isVoice ? getAudioUrl() : '';

  if (isVoice) {
    return (
      <div
        ref={messageRef}
        className={`messageContainer ${isOurs ? 'messageContainer--ours' : 'messageContainer--theirs'}`}
        onContextMenu={handleContextMenu}
        onMouseLeave={handleMenuMouseLeave}
      >
        <div className="voice-message-wrapper">
          {audioUrl ? (
            <audio 
              className="messageContainer__audio" 
              controls 
              preload="metadata"
              src={audioUrl}
              style={{ width: '250px' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🎤</span>
              <span>{text || 'Голосовое сообщение'}</span>
            </div>
          )}
        </div>
        
        <span className="messageContainer__time">{NormalTime}</span>

        {contextMenuVisible.visible && (
          <div
            ref={menuRef}
            className='messageContainer__contextMenu'
            style={{
              top: contextMenuVisible.y,
              left: contextMenuVisible.x
            }}
          >
            <ul className='messageContainer__contextMenu-list'>
              <li 
                className='messageContainer__contextMenu-item' 
                onClick={() => {
                  deleteMessage(messageId);
                  setContextMenuVisible({ visible: false, x: 0, y: 0 });
                }}
              >
                Удалить сообщение
              </li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={messageRef}
      className={`messageContainer ${isOurs ? 'messageContainer--ours' : 'messageContainer--theirs'}`}
      onContextMenu={handleContextMenu}
      onMouseLeave={handleMenuMouseLeave}
    >
      <span className="messageContainer__text">{text}</span>
      <span className="messageContainer__time">{NormalTime}</span>

      {contextMenuVisible.visible && (
        <div
          ref={menuRef}
          className='messageContainer__contextMenu'
          style={{
            top: contextMenuVisible.y,
            left: contextMenuVisible.x
          }}
        >
          <ul className='messageContainer__contextMenu-list'>
            <li 
              className='messageContainer__contextMenu-item'
              onClick={() => {
                navigator.clipboard.writeText(text);
                setContextMenuVisible({ visible: false, x: 0, y: 0 });
              }}
            >
              Копировать текст
            </li>
            <li 
              className='messageContainer__contextMenu-item' 
              onClick={() => {
                deleteMessage(messageId);
                setContextMenuVisible({ visible: false, x: 0, y: 0 });
              }}
            >
              Удалить сообщение
            </li>
            <li className='messageContainer__contextMenu-item' onClick={()=>{
              console.log(messageRef);
            }}>Редактировать сообщение</li>
          </ul>
        </div>
      )}
    </div>
  );
};

import './Message.scss'
import { useState, useEffect, useRef } from 'react';

export const Message = ({isOurs, text, voiceMessageObj, time, messageId, deleteMessage}) => {
  const [contextMenuVisible, setContextMenuVisible] = useState({
    visible: false,
    x: 0,
    y: 0
  });

  const menuRef = useRef(null);
  const messageRef = useRef(null);

  // 🔍 ДЛЯ ОТЛАДКИ
  console.log('🔍 Message DEBUG:');
  console.log('text:', text);
  console.log('voiceMessageObj:', voiceMessageObj);
  console.log('time:', time);
  console.log('messageId:', messageId);
  console.log('---');

  // Функция для определения, это голосовое сообщение
  const isVoiceMessage = () => {
    // ВАЖНО: Проверяем, пришел ли voiceMessageObj как параметр
    // НО: в данных с сервера voiceMessageObj будет внутри объекта message
    // Так что проверяем оба варианта
    return !!voiceMessageObj || text === "[Голосовое сообщение]";
  };

  // Функция для получения URL аудио - УПРОЩЕННАЯ версия
  const getAudioUrl = () => {
    if (!voiceMessageObj) {
      console.log('❌ voiceMessageObj пустой');
      return '';
    }
    
    console.log('✅ voiceMessageObj:', voiceMessageObj);
    
    // Если voiceMessageObj - это строка (URL)
    if (typeof voiceMessageObj === 'string') {
      const url = voiceMessageObj.startsWith('/') 
        ? `http://localhost:3001${voiceMessageObj}`
        : voiceMessageObj;
      console.log('📌 Строковый URL:', url);
      return url;
    }
    
    // Если voiceMessageObj - это объект
    if (typeof voiceMessageObj === 'object') {
      // Пробуем все возможные поля
      const possibleFields = ['file', 'voice_text', 'audioUrl', 'url'];
      for (const field of possibleFields) {
        if (voiceMessageObj[field]) {
          const url = voiceMessageObj[field].startsWith('/')
            ? `http://localhost:3001${voiceMessageObj[field]}`
            : voiceMessageObj[field];
          console.log(`📌 Нашли поле ${field}:`, url);
          return url;
        }
      }
    }
    
    console.log('❌ Не удалось извлечь URL');
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
  
  // Проверяем, это голосовое сообщение
  const isVoice = isVoiceMessage();
  const audioUrl = getAudioUrl();
  
  console.log('🎯 Итог: isVoice =', isVoice, 'audioUrl =', audioUrl);

  // ЕСЛИ voiceMessageObj существует ИЛИ текст "[Голосовое сообщение]" - показываем аудио
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

        {/* Контекстное меню */}
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

  // 📝 Текстовое сообщение (НЕ голосовое)
  return (
    <div
      ref={messageRef}
      className={`messageContainer ${isOurs ? 'messageContainer--ours' : 'messageContainer--theirs'}`}
      onContextMenu={handleContextMenu}
      onMouseLeave={handleMenuMouseLeave}
    >
      <span className="messageContainer__text">{text}</span>
      <span className="messageContainer__time">{NormalTime}</span>

      {/* Контекстное меню */}
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
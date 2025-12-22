// VoiceInput.jsx - ИСПРАВЛЕННЫЙ
import React, { useState, useEffect, useRef } from 'react';

export const VoiceInput = ({ currentChatId, setChats }) => { // ← ПРИНИМАЕМ setChats
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  
  const [recording, setRecording] = useState(false);
  const [permission, setPermission] = useState(false);
  const shouldSendRef = useRef(false);

  // Функция для отправки файла на сервер
  const uploadVoiceMessage = async (file, duration) => {
    if (!currentChatId) {
      console.error('❌ Нет ID чата для отправки голосового сообщения');
      alert('Выберите чат для отправки сообщения');
      return;
    }

    if (!setChats) {
      console.error('❌ Нет setChats для обновления состояния');
      alert('Ошибка: не могу обновить чаты');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('voice', file);
      formData.append('duration', duration || 0);

      console.log(`📤 Отправляю голосовое в чат ${currentChatId}`, {
        filename: file.name,
        size: file.size,
        type: file.type
      });

      const response = await fetch(`http://localhost:3001/api/chats/${currentChatId}/voice-upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Ответ от сервера:', result);
      
      // ВОТ САМОЕ ВАЖНОЕ! Обновляем состояние чатов
      if (result.chats && setChats) {
        console.log('🔄 Обновляю состояние чатов...');
        setChats(result.chats); // ← ОБНОВЛЯЕМ ЧАТЫ
        
        // Для отладки - посмотрим что обновили
        const updatedChat = result.chats.find(chat => chat.id === currentChatId);
        console.log('💬 Обновленный чат:', updatedChat);
        console.log('🎤 Последнее сообщение:', updatedChat?.messages?.slice(-1));
      } else {
        console.warn('⚠️ Не получилось обновить чаты:', {
          hasChats: !!result.chats,
          hasSetChats: !!setChats
        });
      }

    } catch (error) {
      console.error('❌ Ошибка при отправке голосового сообщения:', error);
      alert(`Ошибка отправки: ${error.message}`);
    }
  };


  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus', 
      'audio/mp4',
      'audio/mpeg'
    ];
    
    for (let type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log('Поддерживаемый тип:', type);
        return type;
      }
    }
    console.log('Ни один MIME-тип не поддерживается, используем дефолтный');
    return '';
  };

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && navigator.mediaDevices) {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true })
  //       .then(() => {
  //         setPermission(true);
  //       })
  //       .catch((err) => {
  //         console.error('Ошибка доступа к микрофону:', err);
  //         setPermission(false);
  //       });
  //   }
  // }, []);

  const startRecording = async () => {
    // if (!permission) {
    //   alert('Нет доступа к микрофону');
    //   return;
    // }

    if (!currentChatId) {
      alert('Сначала выберите чат для отправки сообщения');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true
      });

      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : {};
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      audioChunksRef.current = [];
      shouldSendRef.current = false;

      // Обработчик данных
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Обработчик завершения записи
      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          console.log('Нет данных записи');
          return;
        }

        console.log('Запись остановлена');

        const blobType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
        
        // Создаем файл
        const fileName = `voice_${Date.now()}.webm`;
        const file = new File([audioBlob], fileName, { type: blobType });

        // Если пользователь нажал "отправить" - отправляем на сервер
        if (shouldSendRef.current) {
          await uploadVoiceMessage(file, 0); // duration можно вычислить позже
        } else {
          console.log('Запись отменена');
        }

        // Очищаем
        audioChunksRef.current = [];

        // Останавливаем микрофон
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Начинаем запись
      mediaRecorderRef.current.start();
      setRecording(true);
      console.log('Запись начата');

    } catch (error) {
      console.error('Ошибка при записи:', error);
      alert(`Не удалось начать запись: ${error.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      console.log('Останавливаем запись');
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

 const handleRecordClick = async () => {
  if (recording) {
    stopRecording();
  } else {
    if (!permission) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermission(true);
        startRecording();
      } catch (err) {
        console.error('Ошибка доступа к микрофону:', err);
        setPermission(false);
        alert('Не удалось получить доступ к микрофону');
        return;
      }
    } else {
      startRecording();
    }
  }
};

  const handleSendClick = () => {
    shouldSendRef.current = true;
    stopRecording();
  };

  const handleCancelClick = () => {
    shouldSendRef.current = false;
    stopRecording();
  };

  // Очистка
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <>
      {!recording ? (
        <button 
          className="Chat-form__button" 
          type="button"
          onClick={handleRecordClick}
          title="Начать запись голосового сообщения"
        >
          <img  
            src="/mic.svg" 
            alt="Record" 
            width="30px" 
            height="40px"
          />
        </button>
      ) : (
        <>
          <button 
            className="Chat-form__button" 
            type="button"
            onClick={handleCancelClick}
            title="Отменить запись"
            style={{ backgroundColor: '#ff4444' }}
          >
            ✕
          </button>
          
          <button 
            className="Chat-form__button" 
            type="button"
            onClick={handleSendClick}
            title="Отправить запись"
            style={{ 
              backgroundColor: '#4CAF50',
              animation: 'pulse 1.5s infinite'
            }}
          >
            <img src="/inputBtn.svg" alt="Send" width="30px" height="35px"/>
          </button>
        </>
      )}
    </>
  );
};
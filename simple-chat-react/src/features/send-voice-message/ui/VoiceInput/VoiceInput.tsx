import { useEffect, useRef, useState } from 'react';

import { uploadVoiceMessage } from '../../model/uploadVoiceMessage';
import type { Chat } from '../../../../entities/chat/model/types';

interface VoiceInputProps {
  currentChatId: number;
  setChats: (chats: Chat[]) => void;
}

export const VoiceInput = ({ currentChatId, setChats }: VoiceInputProps) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const shouldSendRef = useRef<boolean>(false);

  const [recording, setRecording] = useState(false);
  const [permission, setPermission] = useState(false);

  const getErrorMessage = (error: unknown): string =>
    error instanceof Error ? error.message : 'Неизвестная ошибка';

  const hasMediaSupport = () => {
    return !!(
      typeof window !== 'undefined' &&
      navigator?.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined'
    );
  };

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/mpeg',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return '';
  };

  const startRecording = async () => {
    if (currentChatId === undefined || currentChatId === null) {
      alert('Сначала выберите чат для отправки сообщения');
      return;
    }

    if (!setChats) {
      alert('Ошибка: не могу обновить чаты');
      return;
    }

    if (!hasMediaSupport()) {
      alert('Ваш браузер не поддерживает запись с микрофона');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const options = mimeType ? { mimeType } : {};

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];
      shouldSendRef.current = false;

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          return;
        }

        const blobType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: blobType });
        const file = new File([audioBlob], `voice_${Date.now()}.webm`, { type: blobType });

        if (shouldSendRef.current) {
          try {
            await uploadVoiceMessage({
              chatId: currentChatId,
              file,
              duration: 0,
              setChats,
            });
          } catch (error: unknown) {
            alert(`Ошибка отправки: ${getErrorMessage(error)}`);
          }
        }

        audioChunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error: unknown) {
      console.error('Ошибка при записи:', error);
      alert(`Не удалось начать запись: ${getErrorMessage(error)}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleRecordClick = async () => {
    if (recording) {
      stopRecording();
      return;
    }

    if (!hasMediaSupport()) {
      alert('Ваш браузер не поддерживает запись с микрофона');
      return;
    }

    if (!permission) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setPermission(true);
      } catch (error: unknown) {
        console.error('Ошибка доступа к микрофону:', error);
        setPermission(false);
        alert('Не удалось получить доступ к микрофону');
        return;
      }
    }

    startRecording();
  };

  const handleSendClick = () => {
    shouldSendRef.current = true;
    stopRecording();
  };

  const handleCancelClick = () => {
    shouldSendRef.current = false;
    stopRecording();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      {!recording ? (
        <button
          className='Chat-form__button'
          type='button'
          onClick={handleRecordClick}
          title='Начать запись голосового сообщения'
        >
          <img src='/mic.svg' alt='Record' width='30px' height='40px' />
        </button>
      ) : (
        <>
          <button
            className='Chat-form__button'
            type='button'
            onClick={handleCancelClick}
            title='Отменить запись'
            style={{ backgroundColor: '#ff4444' }}
          >
            ✕
          </button>

          <button
            className='Chat-form__button'
            type='button'
            onClick={handleSendClick}
            title='Отправить запись'
            style={{ backgroundColor: '#4CAF50', animation: 'pulse 1.5s infinite' }}
          >
            <img src='/inputBtn.svg' alt='Send' width='30px' height='35px' />
          </button>
        </>
      )}
    </>
  );
};

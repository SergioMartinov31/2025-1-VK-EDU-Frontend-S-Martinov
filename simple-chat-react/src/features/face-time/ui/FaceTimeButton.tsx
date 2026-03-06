import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useCall } from '../lib/useCall';

interface CallUser {
  id: number;
  username: string;
}

interface FaceTimeButtonProps {
  currentUser: CallUser;
  targetUser: CallUser;
}

export const FaceTimeButton = ({ currentUser, targetUser }: FaceTimeButtonProps) => {
  const [showVideo, setShowVideo] = useState(false);

  const {
    stream,
    remoteStream,
    incomingCall,
    isCallActive,
    startCall,
    endCall,
    acceptCall,
    rejectCall,
  } = useCall(currentUser);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const shouldShowOverlay = showVideo || Boolean(incomingCall);

  useEffect(() => {
    if (!localVideoRef.current || !stream || !shouldShowOverlay) return;
    localVideoRef.current.srcObject = stream;
    void localVideoRef.current.play().catch(() => {});
  }, [stream, shouldShowOverlay]);

  useEffect(() => {
    if (!remoteVideoRef.current || !remoteStream || !shouldShowOverlay) return;
    remoteVideoRef.current.srcObject = remoteStream;
    void remoteVideoRef.current.play().catch(() => {});
  }, [remoteStream, shouldShowOverlay]);

  const handleCall = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    startCall(targetUser);
    setShowVideo(true);
  };

  const handleEndCall = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    endCall();
    setShowVideo(false);
  };

  const handleAccept = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    acceptCall();
    setShowVideo(true);
  };

  const handleReject = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    rejectCall();
    setShowVideo(false);
  };

  // Если нет камеры - не показываем кнопку вызова.
  if (!stream) return null;

  return (
    <>
      <button
        type='button'
        onClick={handleCall}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        <svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
          <path d='M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z' />
        </svg>
      </button>

      {shouldShowOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 9999,
          }}
        >
          {isCallActive ? (
            <video
              autoPlay
              playsInline
              ref={remoteVideoRef}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              Ожидание подключения...
            </div>
          )}

          <video
            autoPlay
            playsInline
            muted
            ref={localVideoRef}
            style={{
              position: 'absolute',
              bottom: 100,
              right: 20,
              width: 200,
              height: 150,
              objectFit: 'cover',
              border: '2px solid white',
              borderRadius: 8,
              background: '#111',
            }}
          />

          <button
            type='button'
            onClick={handleEndCall}
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'red',
              color: 'white',
              border: 'none',
              borderRadius: 50,
              padding: '12px 24px',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Завершить
          </button>

          {incomingCall && !isCallActive && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: 20,
                borderRadius: 10,
              }}
            >
              <p>📞 {incomingCall.username} звонит...</p>
              <button type='button' onClick={handleAccept} style={{ marginRight: 10 }}>
                Ответить
              </button>
              <button type='button' onClick={handleReject}>
                Отклонить
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

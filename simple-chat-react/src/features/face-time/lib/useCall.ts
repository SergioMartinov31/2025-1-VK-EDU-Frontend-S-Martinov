import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer/simplepeer.min.js';
import type { Instance as PeerInstance, Options as PeerOptions, SignalData } from 'simple-peer';
import { getSocket } from '../../../shared/lib';

interface CallUser {
  id: number;
  username: string;
}

interface IncomingCall {
  from: number;
  username: string;
  offer: SignalData;
}

const createPeer = (initiator: boolean, stream: MediaStream) =>
  new (SimplePeer as unknown as new (opts?: PeerOptions) => PeerInstance)({
    initiator,
    trickle: false,
    stream,
  });

export const useCall = (currentUser: CallUser) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const peerRef = useRef<PeerInstance | null>(null);
  const peerUserIdRef = useRef<number | null>(null);

  // Получаем доступ к камере один раз.
  useEffect(() => {
    let localStream: MediaStream | null = null;
    let disposed = false;

    const initMedia = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('getUserMedia не поддерживается');
        }
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!disposed) {
          setStream(localStream);
        }
      } catch (err) {
        console.error('Нет доступа к камере:', err);
      }
    };

    void initMedia();

    return () => {
      disposed = true;
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const cleanupCall = () => {
    peerRef.current?.destroy();
    peerRef.current = null;
    peerUserIdRef.current = null;
    setRemoteStream(null);
    setIsCallActive(false);
    setIncomingCall(null);
  };

  // Подписки на socket-события (с небольшим retry, если сокет ещё не создан).
  useEffect(() => {
    if (!stream) return;

    let cleanupSocket: (() => void) | null = null;

    const attach = () => {
      const socket = getSocket();
      if (!socket) return false;

      const onOffer = (payload: { from: number; fromUsername: string; offer: unknown }) => {
        setIncomingCall({
          from: payload.from,
          username: payload.fromUsername,
          offer: payload.offer as SignalData,
        });
      };

      const onAnswer = (payload: { answer: unknown }) => {
        if (!peerRef.current) return;
        peerRef.current.signal(payload.answer as SignalData);
      };

      const onEnd = () => {
        cleanupCall();
      };

      socket.on('video:offer', onOffer);
      socket.on('video:answer', onAnswer);
      socket.on('video:end', onEnd);

      cleanupSocket = () => {
        socket.off('video:offer', onOffer);
        socket.off('video:answer', onAnswer);
        socket.off('video:end', onEnd);
      };
      return true;
    };

    if (attach()) {
      return () => cleanupSocket?.();
    }

    const retryId = window.setInterval(() => {
      if (attach()) {
        window.clearInterval(retryId);
      }
    }, 300);

    return () => {
      window.clearInterval(retryId);
      cleanupSocket?.();
    };
  }, [stream]);

  const startCall = (targetUser: CallUser) => {
    if (!stream) return;
    const socket = getSocket();
    if (!socket) return;

    cleanupCall();
    peerUserIdRef.current = targetUser.id;

    const peer = createPeer(true, stream);

    peer.on('signal', (offer) => {
      socket.emit('video:offer', {
        targetUserId: targetUser.id,
        offer,
      });
    });

    peer.on('stream', (remote) => {
      setRemoteStream(remote);
      setIsCallActive(true);
    });

    peerRef.current = peer;
  };

  const acceptCall = () => {
    if (!stream || !incomingCall) return;
    const socket = getSocket();
    if (!socket) return;

    cleanupCall();
    peerUserIdRef.current = incomingCall.from;

    const peer = createPeer(false, stream);

    peer.on('signal', (answer) => {
      socket.emit('video:answer', {
        targetUserId: incomingCall.from,
        answer,
      });
    });

    peer.on('stream', (remote) => {
      setRemoteStream(remote);
      setIsCallActive(true);
    });

    peer.signal(incomingCall.offer);
    peerRef.current = peer;
    setIncomingCall(null);
  };

  const rejectCall = () => {
    const socket = getSocket();
    if (socket && incomingCall) {
      socket.emit('video:end', { targetUserId: incomingCall.from });
    }
    cleanupCall();
  };

  const endCall = () => {
    const socket = getSocket();
    const targetUserId = peerUserIdRef.current;

    if (socket && targetUserId !== null) {
      socket.emit('video:end', { targetUserId });
    }

    cleanupCall();
  };

  return {
    stream,
    remoteStream,
    incomingCall,
    isCallActive,
    startCall,
    endCall,
    acceptCall,
    rejectCall,
    currentUser,
  };
};

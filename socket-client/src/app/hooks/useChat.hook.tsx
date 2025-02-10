import { useCallback, useEffect, useState } from 'react';
import socket from '@/gateway/socket';

interface Payload {
  type: 'JOIN' | 'LEFT' | 'SAY';
  username: string;
  message?: string;
  timestamp: Date;
}

export function useChat() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Payload[]>([]);
  const [userActives, setUserActives] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('username', (message) => {
      if (message === 'OK') {
        setConnected(true);
      } else {
        alert('O usuário já existe na sala');
      }
    });

    socket.on('message', (message) => {
      if (message.type === 'JOIN') {
        new Audio('/notification.mp3').play();
      }
      setMessages((prev) => [...prev, message]);
    });

    socket.on('userActives', setUserActives);

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSetUsername = useCallback((username: string) => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('username', username);
    setUsername(username);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    socket.emit('message', { type: 'SAY', message });
  }, []);

  const handleDisconnect = useCallback(() => {
    socket.disconnect();
    setConnected(false);
    setUsername('');
    setMessages([]);
    setIsOpen(false);
  }, []);

  const handleTyping = useCallback((isTyping: boolean) => {
    socket.emit('typing', isTyping);
  }, []);

  return {
    connected,
    username,
    messages,
    userActives,
    handleSetUsername,
    handleSendMessage,
    handleDisconnect,
    handleTyping,
    isOpen,
    setIsOpen,
  };
}

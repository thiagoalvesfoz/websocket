"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Username } from "./components/username.component";
import { Sender } from "./components/sender.component";
import { Menu } from 'lucide-react';
import socket from '@/gateway/socket';
import TypingUsers from './components/typing.component';
import Sidebar from './components/sidebar.component';

interface Payload {
  type: 'JOIN' | 'LEFT' | 'SAY';
  username: string;
  message?: string;
  timestamp: Date;
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Payload[]>([]);
  const [userActives, setUserAtives] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('username', (message) => {
      // console.log(message);
      if (message === 'OK') {
        setConnected(true);
      } else {
        alert('O usuário já existe na sala');
      }
    });

    socket.on('message', (message) => {
      // console.log(message);

      if (message.type === 'JOIN') {
        const audio = new Audio('/notification.mp3');
        audio.play();
      }

      setMessages((prev) => [...prev, message]);
    });

    socket.on('userActives', (userActives: string[]) => {
      setUserAtives(userActives);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
  }, []);

  const handleTyping = useCallback((isTyping: boolean) => {
    socket.emit('typing', isTyping);
  }, []);

  if (!connected) {
    return (
      <div className="bg-gray-300 flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Username handleSubmit={handleSetUsername} />
      </div>
    );
  }

  const messageClassName = {
    JOIN: 'text-emerald-600 ',
    LEFT: 'text-red-600',
    SAY: 'text-gray-700',
  };

  function formatTime(timestamp: Date | string | number) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Data inválida';

    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hour}:${minutes}`;
  }

  const Message = ({ payload }: { payload: Payload }) => {
    if (payload.type !== 'SAY') {
      return (
        <div
          className={`${
            messageClassName[payload.type]
          } font-medium text-center py-4`}
        >
          {payload.username}{' '}
          {payload.type === 'JOIN' ? 'entrou na sala' : 'saiu da sala'}
        </div>
      );
    }

    const isSelf = username === payload.username;

    return (
      <div
        data-self={isSelf}
        className="flex flex-row-reverse data-[self=true]:flex-row"
      >
        <div className="flex-1"></div>
        <div
          data-self={isSelf}
          className="p-2 bg-slate-200 data-[self=true]:bg-emerald-100 rounded-lg max-w-[90%] md:max-w-[40%]"
        >
          {!isSelf && (
            <span className="font-bold text-sm text-gray-950">
              {payload.username}
            </span>
          )}
          <div className="space-x-3">
            <span className="break-words text-md text-slate-600 ">
              {payload.message}
            </span>
            <span className="font-normal text-xs text-slate-400">
              {formatTime(payload.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const ChatHeader = () => {
    return (
      <div className="z-10 flex items-center justify-between p-4 gap-8">
        <button
          className="p-2 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-md"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
        <h1 className="flex-1 text-lg font-bold text-gray-900">Sala</h1>
        <button
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          onClick={handleDisconnect}
        >
          Sair
        </button>
      </div>
    );
  };

  const Chat = () => {
    return (
      <div className="border-y flex-1 p-4 bg-neutral-100 overflow-auto">
        <div className="space-y-2 flex flex-col flex-1 ">
          {messages.map((payload, index) => (
            <Message payload={payload} key={index} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <TypingUsers self={username} />
      </div>
    );
  };

  return (
    <div className="text-gray-700 bg-gray-300 flex flex-col items-center justify-center min-h-dvh max-h-dvh p-0 lg:p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="overflow-hidden flex-1 flex w-full max-w-[1366px] h-full bg-white rounded-md shadow-md ">
        <Sidebar isOpen={isOpen} self={username} users={userActives} />
        <div className="flex-1 flex flex-col">
          <ChatHeader />
          <Chat />
          <Sender
            handleSubmit={handleSendMessage}
            handleTyping={handleTyping}
          />
        </div>
      </div>
    </div>
  );
}

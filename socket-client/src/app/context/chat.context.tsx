'use client';

import { createContext, useContext } from 'react';
import { useChat } from '../hooks/useChat.hook';

const ChatContext = createContext<ReturnType<typeof useChat> | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const chat = useChat();
  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error('useChatContext deve ser usado dentro de ChatProvider');
  return context;
};

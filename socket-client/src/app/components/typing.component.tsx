import React, { useEffect, useState } from 'react';
import socket from '@/gateway/socket';

interface TypingProps {
  self: string;
}

const TypingUsers: React.FC<TypingProps> = ({ self }) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]); // Estado para armazenar a lista de usuários digitando

  useEffect(() => {
    if (!socket.connected) {
      return;
    }

    socket.on('typingUpdate', (users: string[]) => {
      const filteredUsers = users.filter((user) => user !== self);
      setTypingUsers(filteredUsers);
    });

    return () => {
      socket.off('typingUpdate');
    };
  }, [self]);

  const renderTypingMessage = () => {
    if (typingUsers.length === 0) return null;

    const firstUser = typingUsers[0];
    const othersCount = typingUsers.length - 1;

    if (othersCount === 0) {
      return <>{firstUser} está digitando...</>;
    }

    return (
      <>
        {firstUser} e mais {othersCount}{' '}
        {othersCount > 1 ? 'pessoas' : 'pessoa'} estão digitando...
      </>
    );
  };

  if (typingUsers.length === 0) {
    return null;
  }

  return (
    <div className="flex">
      <div className="relative flex gap-1 p-2">
        <div className="size-1.5 bg-slate-500 rounded-full typing-dot" />
        <div className="size-1.5 bg-slate-500 rounded-full typing-dot" />
        <div className="size-1.5 bg-slate-500 rounded-full typing-dot" />
      </div>
      <span className="text-slate-600">{renderTypingMessage()}</span>
    </div>
  );
};

export default TypingUsers;

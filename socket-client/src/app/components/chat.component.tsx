import { useCallback, useEffect, useRef } from 'react';
import { useChatContext } from '../context/chat.context';
import TypingUsers from './typing.component';

interface Payload {
  type: 'JOIN' | 'LEFT' | 'SAY';
  username: string;
  message?: string;
  timestamp: Date;
}

export default function Chat() {
  const { username, messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = useCallback((timestamp: Date | string | number) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Data inválida';

    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hour}:${minutes}`;
  }, []);

  const Message = ({ payload }: { payload: Payload }) => {
    const messageClassName = {
      JOIN: 'text-emerald-600 ',
      LEFT: 'text-red-600',
      SAY: 'text-gray-700',
    };

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

  return (
    <div className="border-y flex flex-col flex-1 p-4 bg-neutral-100 overflow-auto">
      <div className="space-y-2 flex flex-col flex-1">
        {messages.map((payload, index) => (
          <Message payload={payload} key={index} />
        ))}
      </div>
      <TypingUsers />
      <div ref={messagesEndRef} />
    </div>
  );
}

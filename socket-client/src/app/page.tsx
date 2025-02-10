"use client";

import { useChatContext } from './context/chat.context';
import { Username } from './components/username.component';
import { Sender } from './components/sender.component';
import ChatHeader from './components/chat-header.component';
import Sidebar from './components/sidebar.component';
import Chat from './components/chat.component';

export default function Home() {
  const { connected } = useChatContext();

  if (!connected) {
    return <Username />;
  }

  return (
    <div className="overflow-hidden flex-1 flex w-full max-w-[1366px] h-full bg-white rounded-md shadow-md ">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <Chat />
        <Sender />
      </div>
    </div>
  );
}

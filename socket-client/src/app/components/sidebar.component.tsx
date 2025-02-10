import React from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import { useChatContext } from '../context/chat.context';

const Sidebar = () => {
  const { username: self, userActives, isOpen } = useChatContext();

  const UserActive = ({ username }: { username: string }) => {
    const config = genConfig(username);

    return (
      <div
        data-self={self === username}
        className="flex items-center gap-2 data-[self=true]:font-bold"
      >
        <Avatar className="size-8" {...config} />
        {username}
      </div>
    );
  };

  return (
    <aside
      className={` transition-all duration-300 ease-in-out flex flex-col min-w-0  
      ${isOpen ? 'w-64 opacity-100 border-r' : 'w-0 opacity-0'}`}
    >
      <div className="relative w-full h-full flex flex-col">
        <div className="h-[72px] border-b flex items-center justify-between px-4">
          <h2 className="text-lg font-bold whitespace-nowrap ">
            Usuários Online
          </h2>
        </div>

        <ul className="space-y-5 w-full flex-1 overflow-auto p-5">
          {userActives.map((username, i) => (
            <UserActive key={i} username={username} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

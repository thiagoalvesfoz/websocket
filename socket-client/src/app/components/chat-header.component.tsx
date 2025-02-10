import { Menu } from 'lucide-react';
import { useChatContext } from '../context/chat.context';

export default function ChatHeader() {
  const { handleDisconnect, setIsOpen } = useChatContext();

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
}

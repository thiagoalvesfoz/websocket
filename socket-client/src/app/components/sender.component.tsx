import { FormEvent, useRef, useState } from 'react';
import Button from './button.component';
import Input from './input.component';

interface SenderProps {
  handleSubmit: (message: string) => void;
  handleTyping: (isTyping: boolean) => void;
}

export const Sender: React.FC<SenderProps> = ({
  handleSubmit,
  handleTyping,
}) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const inputMessage = form.elements.namedItem('message') as HTMLInputElement;
    const message = inputMessage.value;

    if (!message) return;

    handleSubmit(message);
    form.reset();
  };

  const typing = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (!isTyping) {
      handleTyping(true);
      setIsTyping(true); // Marca como digitando
    }

    typingTimeout.current = setTimeout(() => {
      handleTyping(false);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="flex flex-col w-full space-y-2 text-gray-900"
    >
      <div className="flex items-center space-x-2">
        <Input id="message" onChange={() => typing()} />
        <Button type="submit" />
      </div>
    </form>
  );
};

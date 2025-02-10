import { FormEvent, useRef, useState } from 'react';
import Button from './button.component';
import Input from './input.component';
import { useChatContext } from '../context/chat.context';

export const Sender = () => {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const { handleSendMessage, handleTyping } = useChatContext();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const inputMessage = form.elements.namedItem('message') as HTMLInputElement;
    const message = inputMessage.value;

    if (!message) return;

    handleSendMessage(message);
    form.reset();
  };

  const typing = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (!isTyping) {
      handleTyping(true);
      setIsTyping(true);
    }

    typingTimeout.current = setTimeout(() => {
      handleTyping(false);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="flex items-center space-x-2 p-4"
    >
      <Input id="message" onChange={() => typing()} />
      <Button type="submit" />
    </form>
  );
};

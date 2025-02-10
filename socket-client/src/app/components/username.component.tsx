import { FormEvent } from "react";
import Button from "./button.component";
import Input from "./input.component";
import { useChatContext } from '../context/chat.context';

export const Username = () => {
  const { handleSetUsername } = useChatContext();

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const inputUsername = form.elements.namedItem(
      'username',
    ) as HTMLInputElement;

    const username = inputUsername.value;

    if (!username) return;

    handleSetUsername(username);

    form.reset();
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="flex flex-col w-full max-w-md space-y-2 p-4 text-gray-900"
    >
      <label htmlFor="username">Nome de usuário</label>
      <div className="flex items-center space-x-2">
        <Input id="username" />
        <Button type="submit" />
      </div>
    </form>
  );
};

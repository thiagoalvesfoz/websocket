import { FormEvent } from "react";
import Button from "./button.component";
import Input from "./input.component";

interface UsernameProps {
  handleSubmit: (username: string) => void;
}

export const Username: React.FC<UsernameProps> = ({ handleSubmit }) => {
  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const inputUsername = form.elements.namedItem(
      "username"
    ) as HTMLInputElement;

    const username = inputUsername.value;

    if (!username) return;

    handleSubmit(username);

    form.reset();
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="flex flex-col w-full max-w-md space-y-2 text-gray-900"
    >
      <label htmlFor="username">Nome de usuário</label>
      <div className="flex items-center space-x-2">
        <Input id="username" />
        <Button type="submit" />
      </div>
    </form>
  );
};

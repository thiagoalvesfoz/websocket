import { FormEvent } from "react";
import Button from "./button.component";
import Input from "./input.component";

interface SenderProps {
  handleSubmit: (message: string) => void;
}

export const Sender: React.FC<SenderProps> = ({ handleSubmit }) => {
  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const inputMessage = form.elements.namedItem("message") as HTMLInputElement;
    const message = inputMessage.value;

    if (!message) return;

    handleSubmit(message);
    form.reset();
  };

  return (
    <form
      onSubmit={handleSubmitForm}
      className="flex flex-col w-full space-y-2 text-gray-900"
    >
      <div className="flex items-center space-x-2">
        <Input id="message" />
        <Button type="submit" />
      </div>
    </form>
  );
};

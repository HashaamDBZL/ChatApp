import React, { useState } from "react";

interface InputComponentProps {
  onSendMessage: (message: string, clearInput: () => void) => void;
}

function InputComponent({ onSendMessage }: InputComponentProps) {
  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.trim() !== "") {
      onSendMessage(message.trim(), () => setMessage(""));
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border-solid border-black border-1 w-[85%] mx-auto my-2 h-[40px] flex items-center">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="h-10 px-4 py-2 bg-transparent focus:outline-none"
      />
    </div>
  );
}

export default InputComponent;

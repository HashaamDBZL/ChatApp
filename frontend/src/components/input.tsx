import React, { useState } from "react";

interface InputComponentProps {
  onSendMessage: (message: string) => void;
}

function InputComponent({ onSendMessage }: InputComponentProps) {
  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.trim() !== "") {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border-solid border-black border-1">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full h-10 px-4 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default InputComponent;

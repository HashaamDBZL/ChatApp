import React, { useState } from "react";
import { FaImage } from "react-icons/fa"; // Import an image icon
import VoiceRecorder from "./VoiceRecorder";

interface InputComponentProps {
  onSendMessage: (message: string, clearInput: () => void) => void;
  onImageUpload: (file: File, clearInput: () => void) => void; // Update here to take clearInput
  chatId: string | null;
  otherUserId: string | null;
}

function InputComponent({
  onSendMessage,
  onImageUpload,
  chatId,
  otherUserId,
}: InputComponentProps) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Clear input function to reset the input field
  const clearInput = () => {
    setMessage("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && message.trim() !== "") {
      onSendMessage(message.trim(), clearInput); // Pass clearInput here
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first selected file
    if (file) {
      setImage(file); // Save the image file
      onImageUpload(file, clearInput); // Pass the file and clearInput to parent
    }
  };

  return (
    <div className="flex items-center w-full px-2">
      {/* Image upload icon */}
      <label htmlFor="image-upload" className="cursor-pointer ml-2">
        <FaImage size={20} className="text-gray-600" />
      </label>

      {/* Hidden file input */}
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Message input container with reduced width */}
      <div className="bg-white rounded-lg overflow-hidden border border-black h-[40px] flex items-center w-[90%] ml-4">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="h-10 px-4 py-2 bg-transparent focus:outline-none w-full"
        />
      </div>

      <VoiceRecorder
        chatId={chatId}
        otherUserId={otherUserId}
        clearInput={clearInput}
      />
    </div>
  );
}

export default InputComponent;

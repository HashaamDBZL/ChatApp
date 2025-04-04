import React, { useState, useEffect } from "react";
import ProfilePicture from "../../../frontend/src/components/profilePicture";
import MainChat from "./mainChat";

interface ChatMessagesProps {
  chatId: string | null;
  userImage: string | null;
  userName: string | null;
}

function ChatMessages({ chatId, userImage, userName }: ChatMessagesProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-24 w-full items-center px-12 bg-gray-100">
        <ProfilePicture imageUrl={userImage} />
        <div>{userName}</div>
      </div>
      <MainChat chatId={chatId} />
    </div>
  );
}

export default ChatMessages;

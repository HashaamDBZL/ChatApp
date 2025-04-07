import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import ProfilePicture from "../../../frontend/src/components/profilePicture";
import MainChat from "./mainChat";
import { ChatResponse } from "./chat";

interface ChatMessagesProps {
  chatId: string | null;
  userImage: string | null;
  userName: string | null;
  otherUserId: string | null;
  setChatsFn: Dispatch<SetStateAction<ChatResponse[]>>;
  onIncomingMessage: (message: {
    chatId: string;
    messageContent: string;
    messageTimestamp: string;
    status: string;
  }) => void;
}

function ChatMessages({
  chatId,
  userImage,
  userName,
  otherUserId,
  setChatsFn,
  onIncomingMessage,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex h-24 w-full items-center px-12 bg-gray-100 shrink-0">
        <ProfilePicture imageUrl={userImage} />
        <div>{userName}</div>
      </div>
      <MainChat
        chatId={chatId}
        otherUserId={otherUserId}
        setChats={setChatsFn}
        onIncomingMessage={onIncomingMessage}
      />
    </div>
  );
}

export default ChatMessages;

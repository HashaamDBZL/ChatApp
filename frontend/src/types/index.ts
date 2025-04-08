import { Dispatch, SetStateAction } from "react";

export interface ChatResponse {
  chatId: string;
  lastMessageContent: string | null;
  lastMessageType: string | null;
  messageStatus: string | null;
  messageTimestamp: string | null;
  otherUserName: string | null;
  otherUserImage: string | null;
  otherUserId: string | null;
  hasUnread?: boolean;
}

export interface Message {
  id: string;
  messageContent: string;
  messageTimestamp: string;
  sentByMe: boolean;
  type: "text" | "image";
}

export interface mainChatProps {
  chatId: string | null;
  otherUserId: string | null;
  setChats: Dispatch<SetStateAction<ChatResponse[]>>;
  onIncomingMessage: (message: {
    chatId: string;
    messageContent: string;
    messageTimestamp: string;
    status: string;
  }) => void;
}

export interface InputComponentProps {
  onSendMessage: (message: string, clearInput: () => void) => void;
  onImageUpload: (file: File, clearInput: () => void) => void; // Update here to take clearInput
}

// types.ts
export interface Chat {
  chatId: string;
  lastMessageContent: string;
  messageTimestamp: string;
  messageStatus: string;
}

export interface UserData {
  id: string;
  name: string;
  image: string;
  about: string;
  number: string;
  email: string;
  password: string;
}

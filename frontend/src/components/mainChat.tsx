import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import InputComponent from "./input";
import React from "react";
import { useAuth } from "../contexts/AuthContexts";
import { formatDateTimeString } from "../utils/dateUtils";
import socket from "../socket";
import { ChatResponse } from "./chat";

interface Message {
  id: string;
  messageContent: string;
  messageTimestamp: string;
  sentByMe: boolean;
  type: "text" | "image";
}
interface props {
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

const MainChat = ({
  chatId,
  otherUserId,
  setChats,
  onIncomingMessage,
}: props) => {
  const chatIdRef = useRef<string | null>(chatId);
  const { token, userId: loggedInUserId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  useEffect(() => {
    if (!loggedInUserId || !chatId) return;

    socket.emit("join", loggedInUserId);

    const handleMessage = (message: any) => {
      const isCurrentChat = message.chatId === chatIdRef.current;

      if (isCurrentChat) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m.id === message.id);
          if (alreadyExists) return prev;

          return [
            ...prev,
            {
              ...message,
              sentByMe: message.senderId === loggedInUserId,
              messageTimestamp: new Date().toISOString(),
            },
          ];
        });
      }

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chatId === message.chatId
            ? {
                ...chat,
                lastMessageContent: message.messageContent,
                messageTimestamp: new Date().toISOString(),
                messageStatus: message.status,
              }
            : chat
        )
      );

      if (!isCurrentChat) {
        onIncomingMessage({
          chatId: message.chatId,
          messageContent: message.messageContent,
          messageTimestamp: new Date().toISOString(),
          status: message.status,
        });
      }
    };

    socket.on("new_message", (message) => {
      handleMessage(message);
    });

    return () => {
      socket.off("new_message", handleMessage);
    };
  }, [loggedInUserId, chatId]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/chats/${chatId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: loggedInUserId }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Message[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchChatMessages();
  }, [chatId]);

  const sendMessage = async (
    message: string,
    clearInput: () => void,
    type: "text" | "image"
  ) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    if (!loggedInUserId) {
      console.error("Logged-in user ID not available");
      return;
    }

    if (!chatId) {
      console.warn("Chat ID is not yet set");
      return;
    }

    if (!otherUserId) {
      console.warn("Receiver ID (other user in chat) is not yet set");
      return;
    }

    if (!message.trim()) {
      return;
    }

    const messageData = {
      chatId: chatId,
      recieverId: otherUserId,
      senderId: loggedInUserId,
      messageContent: message.trim(),
      status: "sent",
      type,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/messages/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(messageData),
        }
      );

      if (response.ok) {
        const savedMessage = await response.json();
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.chatId === chatId
              ? {
                  ...chat,
                  lastMessageContent: savedMessage.messageContent,
                  messageStatus: savedMessage.status,
                  messageTimestamp: new Date().toISOString(),
                }
              : chat
          )
        );

        clearInput();
      } else {
        console.error(
          "Failed to send message:",
          response.status,
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const onImageUpload = async (file: File, clearInput: () => void) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", loggedInUserId!);
    formData.append("recieverId", otherUserId!);
    formData.append("chatId", chatId!);

    try {
      const response = await fetch(
        "http://localhost:3000/api/messages/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const newMessage = await response.json();
        clearInput();
      } else {
        console.error("Image upload failed:", response.status);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="flex flex-col justify-end overflow-y-auto">
      <div className="flex-grow flex flex-col overflow-y-scroll px-20 min-h-[36.1rem] pt-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-full flex ${
              message.sentByMe ? "justify-end" : "justify-start"
            }`}
          >
            <div className="mb-2 bg-white rounded-md w-fit max-w-[80%] px-4 flex flex-col">
              {message.type === "image" ? (
                <img
                  src={message.messageContent}
                  alt="Message content"
                  className="max-w-full rounded-md"
                />
              ) : (
                <p className="break-words whitespace-pre-wrap">
                  {message.messageContent}
                </p>
              )}
              <small className="ml-auto w-full text-end">
                {formatDateTimeString(message.messageTimestamp)}
              </small>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex bg-gray-100">
        <InputComponent
          onSendMessage={(message, clearInput) =>
            sendMessage(message, clearInput, "text")
          }
          onImageUpload={(file, clearInput) => onImageUpload(file, clearInput)}
        />
      </div>
    </div>
  );
};

export default MainChat;

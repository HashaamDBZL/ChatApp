import { useEffect, useState } from "react";
import InputComponent from "./input";
import React from "react";
import { useAuth } from "../contexts/AuthContexts";
import { formatDateTimeString } from "../utils/dateUtils";
import socket from "../socket";
import { io } from "socket.io-client";

interface Message {
  id: string;
  messageContent: string;
  messageTimestamp: string;
  sentByMe: boolean;
}
interface props {
  chatId: string | null;
  otherUserId: string | null;
}

const MainChat = ({ chatId, otherUserId }: props) => {
  const { token, userId: loggedInUserId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!loggedInUserId || !chatId) return;

    socket.emit("join", loggedInUserId);

    const handleMessage = (message: any) => {
      if (message.chatId === chatId) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m.id === message.id); // Avoid duplicate
          if (alreadyExists) return prev;

          return [
            ...prev,
            {
              ...message,
              sentByMe: message.senderId === loggedInUserId,
            },
          ];
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

  const sendMessage = async (message: string, clearInput: () => void) => {
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

  return (
    <div className=" flex flex-col justify-end overflow-y-auto">
      <div className=" flex-grow flex flex-col overflow-y-scroll">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <p>
              {message.sentByMe ? "You: " : "Other: "}
              {message.messageContent}
            </p>
            <small>{formatDateTimeString(message.messageTimestamp)}</small>
          </div>
        ))}
      </div>
      <InputComponent
        onSendMessage={(message, clearInput) =>
          sendMessage(message, clearInput)
        }
      />
    </div>
  );
};

export default MainChat;

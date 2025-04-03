import React, { useState, useEffect } from "react";

interface Message {
  messageContent: string;
  messageTimestamp: string;
  sentByMe: boolean;
}

interface ChatMessagesProps {
  chatId: string | null; // chatId can be null initially
}

function ChatMessages({ chatId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Add a loading state
  const loggedInUserId = "31621467-2801-40c1-9296-9dfdaefc81db"; // Hardcoded

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId) return;

      setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:3000/api/${chatId}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();
  }, [chatId]);

  const backgroundColorClass = loading || !chatId ? "bg-gray-200" : "bg-white";

  return (
    <div className={`${backgroundColorClass} pt-24`}>
      {messages.map((message, index) => (
        <div key={index} className="mb-2">
          <p>
            {message.sentByMe ? "You: " : "Other: "}
            {message.messageContent}
          </p>
          <small>{message.messageTimestamp}</small>
        </div>
      ))}
    </div>
  );
}

export default ChatMessages;

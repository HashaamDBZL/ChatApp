import { useEffect, useState } from "react";
import InputComponent from "./input";

interface Message {
  messageContent: string;
  messageTimestamp: string;
  sentByMe: boolean;
}
interface props {
  chatId: string | null;
}

const MainChat = ({ chatId }: props) => {
  const loggedInUserId = "31621467-2801-40c1-9296-9dfdaefc81db"; // Hardcoded

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!chatId) return;

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
      }
    };

    fetchChatMessages();
  }, [chatId]);

  //Add implementation
  const sendMessage = () => {};

  return (
    <div className="bg-red-50 h-full flex flex-col justify-between pb-2">
      {/* Messages container with justify-end to keep messages at the bottom initially */}
      <div className="overflow-y-auto flex-grow flex flex-col justify-end">
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
      <InputComponent onSendMessage={sendMessage} />
    </div>
  );
};

export default MainChat;

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts"; // Adjust the path
import ProfilePicture from "./profilePicture";
import { formatDateTimeString } from "../utils/dateUtils";
import StatusIcon from "./statusIcon";
import ChatMessages from "./chatMessage";

interface ChatResponse {
  chatId: string;
  lastMessageContent: string | null;
  messageStatus: string | null;
  messageTimestamp: string | null;
  otherUserName: string | null;
  otherUserImage: string | null;
}

function Chat() {
  const { logout, token } = useAuth();
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserImage, setSelectedUserImage] = useState<string | null>(
    null
  );

  const [isChatSelected, setIsChatSelected] = useState(false); // New state variable

  const handleLogoutClick = () => {
    logout();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/chats/sidebar",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: "4d2ba8c2-c6ba-41df-a1eb-627694671a64",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ChatResponse[] = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const handleChatClick = (
    chatId: string,
    userName: string,
    userImage: string
  ) => {
    setSelectedChatId(chatId);
    setSelectedUserName(userName);
    setSelectedUserImage(userImage);
  };

  const chatMessagesBackgroundColor = isChatSelected
    ? "bg-white"
    : "bg-gray-300";

  return (
    <div className="flex h-[100vh] ">
      <div className="w-4/12 h-full flex-col ">
        <div className="h-24 flex items-center text-start px-12 text-xl font-bold shrink-0">
          Chat
        </div>
        <div className="flex flex-col bg-gray-200 flex-1 overflow-y-auto">
          {chats.map((item, index) => (
            <div
              key={item.chatId}
              className="p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-300 flex items-center"
              onClick={() =>
                handleChatClick(
                  item.chatId,
                  item.otherUserName!,
                  item.otherUserImage!
                )
              }
            >
              <ProfilePicture imageUrl={item.otherUserImage} />
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between">
                  <div className="text-md">{item.otherUserName}</div>
                  <div className="text-xs">
                    {formatDateTimeString(item.messageTimestamp!)}
                  </div>
                </div>
                <div className="flex">
                  <StatusIcon messageStatus={item.messageStatus} />
                  <div
                    className="text-sm truncate overflow-hidden whitespace-nowrap"
                    title={item.lastMessageContent ?? undefined}
                  >
                    {item.lastMessageContent}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`w-8/12 h-full ${chatMessagesBackgroundColor}`}>
        {selectedChatId && (
          <ChatMessages
            chatId={selectedChatId}
            userName={selectedUserName}
            userImage={selectedUserImage}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;

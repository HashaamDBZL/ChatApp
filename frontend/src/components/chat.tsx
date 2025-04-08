import React, { useState, useEffect } from "react";
import ProfilePicture from "./profilePicture";
import { formatDateTimeString } from "../utils/dateUtils";
import StatusIcon from "./statusIcon";
import ChatMessages from "./chatMessage";
import LogoutButton from "./LogoutButton";
import { UserData } from "../types";

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

function Chat() {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserImage, setSelectedUserImage] = useState<string | null>(
    null
  );
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/users/users/${loggedInUserId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setLoggedInUser(data);
      } catch (err) {
        console.error("Error fetching logged-in user info:", err);
        `URL=> ${
          import.meta.env.VITE_BACKEND_URL
        }/api/users/users/${loggedInUserId}`;
      }
    };

    if (loggedInUserId && token) {
      fetchUser();
    }
  }, [loggedInUserId, token]);

  const handleIncomingMessage = (message: {
    chatId: string;
    messageContent: string;
    messageTimestamp: string;
    status: string;
  }) => {
    const { chatId, messageContent, messageTimestamp, status } = message;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastMessageContent: messageContent,
              messageTimestamp: messageTimestamp,
              messageStatus: status,
              hasUnread: chatId !== selectedChatId,
            }
          : chat
      )
    );
  };

  const [isChatSelected, setIsChatSelected] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/chats/sidebar`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: loggedInUserId,
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
    userImage: string,
    userId: string
  ) => {
    setSelectedChatId(chatId);
    setSelectedUserName(userName);
    setSelectedUserImage(userImage);
    setSelectedUserId(userId);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId ? { ...chat, hasUnread: false } : chat
      )
    );
  };

  const chatMessagesBackgroundColor = isChatSelected
    ? "bg-white"
    : "bg-gray-300";

  return (
    <div className="flex h-[100vh] ">
      <div className="w-4/12 h-full flex-col ">
        <div className="h-24 flex items-center text-start px-12 text-xl font-bold shrink-0 justify-between">
          <span>Chat</span>
          <div className="flex items-center">
            <div className="mr-2">{loggedInUser?.name}</div>
            <LogoutButton />
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          {chats.map((item) => (
            <div key={item.chatId}>
              <div
                key={item.chatId}
                className="p-4 cursor-pointer hover:bg-gray-100 flex items-center"
                onClick={() =>
                  handleChatClick(
                    item.chatId,
                    item.otherUserName!,
                    item.otherUserImage!,
                    item.otherUserId!
                  )
                }
              >
                <ProfilePicture imageUrl={item.otherUserImage} />

                <div className="flex flex-col flex-grow min-w-0 ml-2">
                  <div className="flex justify-between items-center">
                    <div className="text-md">{item.otherUserName}</div>
                    <div className="text-xs text-nowrap">
                      {formatDateTimeString(item.messageTimestamp!)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full min-w-0">
                    <StatusIcon messageStatus={item.messageStatus} />
                    <div
                      className="text-sm truncate overflow-hidden whitespace-nowrap flex-1 min-w-0"
                      title={item.lastMessageContent ?? undefined}
                    >
                      {item.lastMessageType === "text"
                        ? item.lastMessageContent
                        : "Image"}
                    </div>
                    {item.hasUnread && (
                      <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex w-[80%] h-[0.5px] bg-gray-400 mx-auto"></div>
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
            otherUserId={selectedUserId}
            setChatsFn={setChats}
            onIncomingMessage={handleIncomingMessage}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;

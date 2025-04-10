import React, { useState, useEffect } from "react";
import ProfilePicture from "./profilePicture";
import { formatDateTimeString } from "../utils/dateUtils";
import StatusIcon from "./statusIcon";
import ChatMessages from "./chatMessage";
import LogoutButton from "./LogoutButton";
import { UserData } from "../types";
import socket from "../socket";

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
  lastMessageSenderId?: string | null;
}

function Chat() {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserImage, setSelectedUserImage] = useState<string | null>(
    null
  );
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const loggedInUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  //Handles real-time updates to sidebar (when a new message arrives)
  const handleIncomingMessage = (message: {
    chatId: string;
    messageContent: string;
    messageTimestamp: string;
    status: string;
    type: string;
  }) => {
    const { chatId, messageContent, messageTimestamp, status, type } = message;
    console.log("Message insideee chat.tsxxxxx", message);

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastMessageContent: messageContent,
              messageTimestamp: messageTimestamp,
              messageStatus: status,
              hasUnread: chatId !== selectedChatId,
              lastMessageType: type,
            }
          : chat
      )
    );
  };

  //Fetch SIdebar data
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

  useEffect(() => {
    console.table(chats);
  }, [chats]);

  //Emits user_online event so the users messages are marked as delivered
  useEffect(() => {
    if (loggedInUserId) {
      socket.emit("user_online", loggedInUserId);
    }
  }, [loggedInUserId]);

  //Updates selected chat info and clears unread badge
  // i.e. when user changes chat, selectedchat info is changed here which is then passed down
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
                    <div
                      className={`text-xs text-nowrap ${
                        item.hasUnread && "text-green-500 font-semibold"
                      }`}
                    >
                      {formatDateTimeString(item.messageTimestamp!)}
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 w-full min-w-0`}>
                    {item.lastMessageSenderId === loggedInUserId && (
                      <StatusIcon messageStatus={item.messageStatus} />
                    )}

                    <div
                      className="text-sm truncate overflow-hidden whitespace-nowrap flex-1 min-w-0"
                      title={item.lastMessageContent ?? undefined}
                    >
                      {item.lastMessageType === "text"
                        ? item.lastMessageContent
                        : item.lastMessageType === "audio"
                        ? "Audio"
                        : item.lastMessageType === "image" && "Image"}
                    </div>
                    {item.hasUnread && (
                      <div className="w-5 h-5 bg-green-500 rounded-full shrink-0 text-white flex items-center justify-center text-sm">
                        1
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex w-[80%] h-[0.5px] bg-gray-400 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-8/12 h-full">
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

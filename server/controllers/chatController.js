const { Message, User, Chat } = require("../models/index.js");
const { sequelize } = require("../config/db.js");
const { Op } = require("sequelize");

async function getChatsWithLatestMessageAndUserData(loggedInUserId) {
  try {
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [{ user1Id: loggedInUserId }, { user2Id: loggedInUserId }],
      },
      attributes: ["id", "lastMessageId", "user1Id", "user2Id"], // Include user IDs
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["id", "name", "image"],
        },
        {
          model: User,
          as: "user2",
          attributes: ["id", "name", "image"],
        },
      ],
    });

    const chatList = await Promise.all(
      chats.map(async (chat) => {
        let lastMessage = null;
        if (chat.lastMessageId) {
          lastMessage = await Message.findOne({
            where: { id: chat.lastMessageId },
            attributes: [
              "messageContent",
              "status",
              "createdAt",
              "type",
              "senderId",
            ],
          });
        }

        let otherUser = null;
        if (chat.user1Id !== loggedInUserId) {
          otherUser = chat.user1;
        } else if (chat.user2Id !== loggedInUserId) {
          otherUser = chat.user2;
        }

        return {
          chatId: chat.id,
          lastMessageContent: lastMessage?.messageContent || null,
          lastMessageType: lastMessage?.type || null,
          messageStatus: lastMessage?.status || null,
          messageTimestamp: lastMessage?.createdAt || null,
          otherUserName: otherUser?.name || null,
          otherUserImage: otherUser?.image || null,
          otherUserId: otherUser?.id,
          lastMessageSenderId: lastMessage?.senderId || null,
        };
      })
    );

    return chatList;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return null;
  }
}

async function getMessagesInChat(chatId, loggedInUserId) {
  try {
    const messages = await Message.findAll({
      where: { chatId: chatId },
      attributes: ["messageContent", "createdAt", "senderId", "type", "status"],
      order: [["createdAt", "ASC"]], // Order messages by timestamp
    });

    const messageList = messages.map((message) => {
      return {
        messageContent: message.messageContent,
        messageTimestamp: message.createdAt,
        sentByMe: message.senderId === loggedInUserId,
        type: message.type,
        status: message.status,
      };
    });

    return messageList;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
}

async function getAllChats(req, res) {
  try {
    const chats = await Chat.findAll({
      include: [
        { model: User, as: "user1", attributes: ["id", "name", "image"] },
        { model: User, as: "user2", attributes: ["id", "name", "image"] },
        {
          model: Message,
          as: "LastMessage",
          attributes: ["id", "messageContent", "createdAt"],
        },
      ],
      order: [[{ model: Message, as: "LastMessage" }, "createdAt", "DESC"]],
    });
    res.json(chats);
  } catch (error) {
    console.error("Error fetching all chats:", error);
    res.status(500).json({ error: "Failed to fetch chats." });
  }
}

module.exports = {
  getChatsWithLatestMessageAndUserData,
  getMessagesInChat,
  getAllChats,
};

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
            attributes: ["messageContent", "status", "createdAt"],
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
          messageStatus: lastMessage?.status || null,
          messageTimestamp: lastMessage?.createdAt || null,
          otherUserName: otherUser?.name || null,
          otherUserImage: otherUser?.image || null,
        };
      })
    );

    return chatList;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return null;
  }
}

module.exports = { getChatsWithLatestMessageAndUserData };

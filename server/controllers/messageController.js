const { Message } = require("../models/index.js");
const { Op } = require("sequelize");

async function getAllMessages(req, res) {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "ASC"]],
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching all messages:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
}

async function updateMessageSenderAndReceiver(
  messageId,
  newSenderId,
  newRecieverId,
  newContent
) {
  try {
    const updatedRowsCount = await Message.update(
      {
        senderId: newSenderId,
        recieverId: newRecieverId,
        messageContent: newContent,
      },
      {
        where: {
          id: messageId,
        },
      }
    );

    if (updatedRowsCount[0] > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
}

async function markMessagesAsDelivered(userId, io) {
  const undeliveredMessages = await Message.findAll({
    where: {
      recieverId: userId,
      status: "sent",
    },
  });
  if (undeliveredMessages.length === 0) return;

  const messageIds = undeliveredMessages.map((msg) => msg.id);

  await Message.update(
    { status: "delivered" },
    {
      where: {
        id: {
          [Op.in]: messageIds,
        },
      },
    }
  );

  for (const message of undeliveredMessages) {
    const senderId = message.senderId;

    if (senderId) {
      io.to(`user_${senderId}`).emit("message_status_updated", {
        messageId: message.id,
        status: "delivered",
        senderId: senderId,
        messageContent: message.messageContent,
      });
    } else {
      console.warn(
        "⚠️ senderId is missing in message:",
        message.toJSON?.() || message
      );
    }
  }
}

async function markMessagesAsRead(chatId, userId, io) {
  try {
    // Step 1: Find delivered messages for this user in the given chat
    const deliveredMessages = await Message.findAll({
      where: {
        chatId,
        recieverId: userId,
        status: "delivered",
      },
    });

    if (deliveredMessages.length === 0) return;

    // Step 2: Update their status to 'read'
    const messageIds = deliveredMessages.map((msg) => msg.id);

    await Message.update(
      { status: "read" },
      {
        where: {
          id: {
            [Op.in]: messageIds,
          },
        },
      }
    );

    // Step 3: Emit socket event to inform chat participants
    for (const message of deliveredMessages) {
      const senderId = message.senderId;

      if (senderId) {
        io.to(`user_${senderId}`).emit("message_status_updated", {
          messageId: message.id,
          status: "read",
          messageContent: message.messageContent,
          senderId: senderId,
        });
      } else {
        console.warn(
          "⚠️ senderId is missing in message:",
          message.toJSON?.() || message
        );
      }
    }
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}

module.exports = {
  getAllMessages,
  updateMessageSenderAndReceiver,
  markMessagesAsDelivered,
  markMessagesAsRead,
};

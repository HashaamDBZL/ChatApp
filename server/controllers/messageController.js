const { Message } = require("../models/index.js");

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
      console.log(`Message with ID ${messageId} updated successfully.`);
      return true; // Or return updatedRowsCount[0] if you need the count
    } else {
      console.log(`Message with ID ${messageId} not found.`);
      return false;
    }
  } catch (error) {
    console.error("Error updating message:", error);
    throw error; // Rethrow for the caller to handle
  }
}

module.exports = {
  getAllMessages,
  updateMessageSenderAndReceiver,
};

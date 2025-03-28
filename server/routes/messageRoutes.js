const express = require("express");
const { Message } = require("../models/message.js");
const { Chat } = require("../models/chat.js");

const router = express.Router();

// POST: Send a message
router.post("/messages", async (req, res) => {
  try {
    const { chatId, senderId, messageContent, status } = req.body;

    // Step 1: Create new message
    const newMessage = await Message.create({
      Chat_id: chatId,
      Sender_id: senderId,
      Message_content: messageContent,
      Status: status || "sent",
    });

    const messageId = newMessage.getDataValue("ID");

    // Step 2: Update lastMessage_id in the Chat table
    await Chat.update({ lastMessage_id: messageId }, { where: { id: chatId } });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;

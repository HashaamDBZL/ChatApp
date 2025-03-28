const express = require("express");
const { Message } = require("../models/Message.js");
const { Chat } = require("../models/Chat.js");

const router = express.Router();

// POST: Send a message
router.post("/messages", async (req, res) => {
  try {
    const { chatId, senderId, recieverId, messageContent, status } = req.body;

    // Step 1: Create new message
    const newMessage = await Message.create({
      chatId: chatId,
      senderId: senderId,
      recieverId: recieverId,
      messageContent: messageContent,
      status: status || "sent",
    });

    const messageId = newMessage.getDataValue("ID");

    // Step 2: Update lastMessage_id in the Chat table
    await Chat.update({ lastMessageId: messageId }, { where: { id: chatId } });

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;

const express = require("express");
const { Message } = require("../models/Message.js");
const { Chat } = require("../models/chat.js");
const {
  getAllMessages,
  updateMessageSenderAndReceiver,
} = require("../controllers/messageController.js");

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

    console.log("New message created:", newMessage);

    const messageId = newMessage.id; // Correct way to get the ID
    console.log("New message ID:", messageId); // Log the correct ID

    console.log("chatId to update:", chatId);

    // Step 2: Update lastMessage_id in the Chat table
    await Chat.update({ lastMessageId: messageId }, { where: { id: chatId } });
    console.log("Chat updated successfully");

    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.put("/messages/:messageId", async (req, res) => {
  const messageId = req.params.messageId;
  const newSenderId = "b16c5d34-2128-46a4-8dcb-6173a3ba7c81";
  const newRecieverId = "31621467-2801-40c1-9296-9dfdaefc81db";
  const newContent = "HAHAHAHAHAHHAHHAHA LOLOLOL";

  try {
    const updateSuccessful = await updateMessageSenderAndReceiver(
      messageId,
      newSenderId,
      newRecieverId,
      newContent
    );

    if (updateSuccessful) {
      res.status(200).json({ message: "Message updated successfully" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

router.get("/messages/all", getAllMessages);

module.exports = router;

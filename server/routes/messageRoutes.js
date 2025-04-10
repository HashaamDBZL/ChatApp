const express = require("express");
const { Message } = require("../models/Message.js");
const { Chat } = require("../models/chat.js");
const {
  getAllMessages,
  updateMessageSenderAndReceiver,
  markMessagesAsDelivered,
  markMessagesAsRead,
} = require("../controllers/messageController.js");
const { redisPublisher } = require("../config/redis");
const authenticate = require("../middleware/authMiddleware.ts");
const multer = require("multer");
const upload = multer();
const uploadToS3 = require("../utils/s3Upload.js");
const { onlineUsers, userCurrentChats } = require("../utils.js");

const router = express.Router();

// POST: Send a message
router.post("/messages", async (req, res) => {
  try {
    const { chatId, senderId, recieverId, messageContent } = req.body;

    let status = "sent";

    if (onlineUsers.has(recieverId)) {
      const currentChatOfReceiver = userCurrentChats.get(recieverId);
      if (currentChatOfReceiver === chatId) {
        status = "read";
      } else {
        status = "delivered";
      }
    }

    // Step 1: Create new message
    const newMessage = await Message.create({
      chatId: chatId,
      senderId: senderId,
      recieverId: recieverId,
      messageContent: messageContent,
      status: status,
    });

    redisPublisher.publish("chat_channel", JSON.stringify(newMessage));
    const messageId = newMessage.id; // Correct way to get the ID

    // Step 2: Update lastMessage_id in the Chat table
    await Chat.update({ lastMessageId: messageId }, { where: { id: chatId } });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
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

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      const { senderId, recieverId, chatId } = req.body;

      let status = "sent";

      if (onlineUsers.has(recieverId)) {
        const currentChatOfReceiver = userCurrentChats.get(recieverId);
        if (currentChatOfReceiver === chatId) {
          status = "read";
        } else {
          status = "delivered";
        }
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = await uploadToS3(req.file);

      // Step 1: Create message for the image
      const newMessage = await Message.create({
        chatId: chatId,
        senderId: senderId,
        recieverId: recieverId,
        messageContent: fileUrl,
        status: status,
        type: "image", // Set message type as image
      });

      // Step 2: Verify the chat exists before updating
      const chat = await Chat.findByPk(chatId);

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      redisPublisher.publish("chat_channel", JSON.stringify(newMessage));

      // Step 3: Update the chat's last message
      const updatedChat = await Chat.update(
        { lastMessageId: newMessage.id },
        { where: { id: chatId } }
      );

      // Check if the update was successful
      if (updatedChat[0] === 0) {
        return res.status(500).json({ error: "Failed to update chat" });
      }

      // Return the created message
      res.status(200).json(newMessage);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

router.put("/delivered", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    await markMessagesAsDelivered(userId);
    res.status(200).json({ message: "Messages marked as delivered" });
  } catch (err) {
    console.error("Failed to mark as delivered:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/chats/:chatId/messages/read", async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    await markMessagesAsRead(chatId, userId);
    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("Failed to mark as read:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/upload/audio",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    try {
      const { senderId, recieverId, chatId } = req.body;

      let status = "sent";

      if (onlineUsers.has(recieverId)) {
        const currentChatOfReceiver = userCurrentChats.get(recieverId);
        if (currentChatOfReceiver === chatId) {
          status = "read";
        } else {
          status = "delivered";
        }
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileUrl = await uploadToS3(req.file);

      // Step 1: Create message for the image
      const newMessage = await Message.create({
        chatId: chatId,
        senderId: senderId,
        recieverId: recieverId,
        messageContent: fileUrl,
        status: status,
        type: "audio", // Set message type as image
      });

      // Step 2: Verify the chat exists before updating
      const chat = await Chat.findByPk(chatId);

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      // Step 3: Update the chat's last message
      const updatedChat = await Chat.update(
        { lastMessageId: newMessage.id },
        { where: { id: chatId } }
      );

      redisPublisher.publish("chat_channel", JSON.stringify(newMessage));

      // Check if the update was successful
      if (updatedChat[0] === 0) {
        return res.status(500).json({ error: "Failed to update chat" });
      }

      // Return the created message
      res.status(200).json(newMessage);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

module.exports = router;

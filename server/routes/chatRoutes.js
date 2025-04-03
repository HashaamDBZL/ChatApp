const express = require("express");
const { Chat } = require("../models/chat.js");
const {
  getChatsWithLatestMessageAndUserData,
  getMessagesInChat,
  getAllChats,
} = require("../controllers/chatController"); // Adjust path if needed.
const router = express.Router();

// POST: Create a new chat
router.post("/chats", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;
    const newChat = await Chat.create({ user1Id: user1Id, user2Id: user2Id });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
});

router.post("/sidebar", async (req, res) => {
  // Change to POST
  const loggedInUserId = req.body.userId; // Get userId from the request body

  if (!loggedInUserId) {
    return res
      .status(400)
      .json({ error: "userId is required in the request body." });
  }

  const chatData = await getChatsWithLatestMessageAndUserData(loggedInUserId);
  if (chatData) {
    res.json(chatData);
  } else {
    res.status(500).json({ error: "Failed to fetch chats." });
  }
});

router.post("/:chatId/messages", async (req, res) => {
  const chatId = req.params.chatId;
  const loggedInUserId = req.body.userId; // Or req.user.id if using auth headers

  if (!chatId || !loggedInUserId) {
    return res.status(400).json({ error: "chatId and userId are required." });
  }

  const messages = await getMessagesInChat(chatId, loggedInUserId);
  if (messages) {
    res.json(messages);
  } else {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

router.get("/chats/all", getAllChats);

module.exports = router;

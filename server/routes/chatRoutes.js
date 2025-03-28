const express = require("express");
const { Chat } = require("../models/chat.js");
const {
  getChatsWithLatestMessageAndUserData,
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

module.exports = router;

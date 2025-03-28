const express = require("express");
const { Chat } = require("../models/chat.js");

const router = express.Router();

// POST: Create a new chat
router.post("/chats", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;
    const newChat = await Chat.create({ User1_id: user1Id, User2_id: user2Id });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create chat" });
  }
});

module.exports = router;

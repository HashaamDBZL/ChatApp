const { User } = require("../models/user.js");
const express = require("express");

const router = express.Router();

// POST: Create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, image, about, number } = req.body;
    const newUser = await User.create({
      Name: name,
      Image: image,
      About: about,
      Number: number,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;

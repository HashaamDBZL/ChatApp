const { User } = require("../models/User.js");
const express = require("express");
const { getAllUsers } = require("../controllers/userController.js");

const router = express.Router();

// POST: Create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, image, about, number } = req.body;
    const newUser = await User.create({
      name: name,
      image: image,
      about: about,
      number: number,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error); // Log the error

    res.status(500).json({ error: "Failed to create user" });
  }
});

//GET: Get all users
router.get("/users/all", getAllUsers);

module.exports = router;

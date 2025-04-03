const { User } = require("../models/index.js");

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
}

module.exports = {
  getAllUsers,
};

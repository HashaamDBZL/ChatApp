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
async function getUserById(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Failed to fetch user." });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
};

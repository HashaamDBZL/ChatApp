// server/models/index.js
const { User } = require("./User");
const { Message } = require("./Message");
const { Chat } = require("./chat");
const { sequelize } = require("../config/db.js");

// User - Chat Relation
User.hasMany(Chat, {
  foreignKey: "user1Id",
  as: "User1Chats",
});
User.hasMany(Chat, {
  foreignKey: "user2Id",
  as: "User2Chats",
});
Chat.belongsTo(User, {
  as: "user1",
  foreignKey: "user1Id",
});
Chat.belongsTo(User, {
  as: "user2",
  foreignKey: "user2Id",
});

// Chat - Message Relations
Chat.hasMany(Message, {
  foreignKey: "chatId",
  onDelete: "CASCADE",
  as: "Messages",
});
Message.belongsTo(Chat, {
  foreignKey: "chatId",
  as: "Chat",
});

// User - Message Relation
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "SentMessages",
});
User.hasMany(Message, {
  foreignKey: "recieverId",
  as: "ReceivedMessages",
});
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});
Message.belongsTo(User, {
  foreignKey: "recieverId",
  as: "receiver",
});

// Last Message relation.
Chat.belongsTo(Message, { foreignKey: "lastMessageId", as: "LastMessage" });
Message.hasOne(Chat, {
  foreignKey: "lastMessageId",
  as: "ChatWithLastMessage",
});

// Sync the models with the database (optional, but recommended for development)
async function syncModels() {
  try {
    await User.sync({ alter: true });
    await Chat.sync({ alter: true });
    await Message.sync({ alter: true });
    console.log("Models synchronized with the database.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
}

module.exports = { User, Message, Chat, syncModels };

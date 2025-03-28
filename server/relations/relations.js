const { User } = require("../models/User");
const { Message } = require("../models/Message");
const { Chat } = require("../models/Chat");

User.hasMany(Chat, {
  foreignKey: "user1Id",
  as: "User1Chats", // Added alias for clarity
});
User.hasMany(Chat, {
  foreignKey: "user2Id",
  as: "User2Chats", // Added alias for clarity
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
  as: "Messages", // Added alias for clarity
});
Message.belongsTo(Chat, {
  foreignKey: "chatId",
  as: "Chat", // Added alias for clarity
});

// User - Message Relation
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "SentMessages", // Added alias for clarity
});
User.hasMany(Message, {
  foreignKey: "recieverId",
  as: "ReceivedMessages", // Changed receiverId to recieverId to match your model. Added alias.
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
Chat.belongsTo(Message, { foreignKey: "lastMessageId", as: "LastMessage" }); // corrected to belongsTo and added alias
Message.hasOne(Chat, {
  foreignKey: "lastMessageId",
  as: "ChatWithLastMessage",
}); // Added hasOne for clarity.

module.exports = { User, Message, Chat };

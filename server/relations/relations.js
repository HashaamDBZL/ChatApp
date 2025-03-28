const { User } = require("../models/user");
const { Message } = require("../models/message");
const { Chat } = require("../models/chat");

// User - Chat Relation
User.hasMany(Chat, {
  foreignKey: "user1Id",
});
User.hasMany(Chat, {
  foreignKey: "user2Id",
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
});
Message.belongsTo(Chat, {
  foreignKey: "chatId",
});

// User - Message Relation
User.hasMany(Message, {
  foreignKey: "senderId",
});
User.hasMany(Message, {
  foreignKey: "receiverId",
});
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});
Message.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
});

Chat.hasOne(Message, { foreignKey: "id", sourceKey: "lastMessageId" });
Message.belongsTo(Chat, { foreignKey: "id", targetKey: "lastMessageId" });

Chat.hasMany(Message);
Message.belongsTo(Chat);

User.hasMany(Message);
Message.belongsTo(User);

module.exports = { User, Message, Chat };

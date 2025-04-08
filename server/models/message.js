const { DataTypes, ENUM } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Chats", // 👈 References the Chats table
        key: "id", // 👈 Uses the primary key of the Chats table
      },
      onDelete: "CASCADE", // If a chat is deleted, delete related messages
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // 👈 References the Users table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    recieverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // 👈 References the Users table
        key: "id",
      },
      onDelete: "CASCADE",
    },
    messageContent: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("sent", "delivered", "read"),
      defaultValue: "sent",
    },
    type: {
      type: DataTypes.ENUM("text", "image", "audio"),
      defaultValue: "text",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Message };

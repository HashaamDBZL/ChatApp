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
    },
    senderId: {
      type: DataTypes.UUID,
    },
    recieverId: {
      type: DataTypes.UUID,
    },
    messageContent: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("sent", "delivered", "read"),
      defaultValue: "sent",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Message };

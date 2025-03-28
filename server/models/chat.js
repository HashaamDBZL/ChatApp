const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user1Id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lastMessageId: {
      type: DataTypes.UUID,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = { Chat };

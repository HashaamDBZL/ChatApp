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
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
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

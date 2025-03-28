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
        model: "Users", // References the Users table
        key: "id", // Uses the primary key of the Users table
      },
      onDelete: "CASCADE",
    },
    user2Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // References the Users table
        key: "id", // Uses the primary key of the Users table
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

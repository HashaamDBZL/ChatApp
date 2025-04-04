const { sequelize } = require("./db");
const { User, Chat, Message } = require("../models/index"); // Import User model

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("✅ Database schema synced successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to sync database:", error);
    process.exit(1);
  }
};

syncDatabase();

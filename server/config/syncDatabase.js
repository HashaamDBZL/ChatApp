const { sequelize } = require("./db"); // Import DB connection
require("../relations/relations.js"); // Ensure relations are loaded

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Use alter for safe updates
    console.log("✅ Database schema synced successfully!");
    process.exit(0); // Exit script after sync
  } catch (error) {
    console.error("❌ Failed to sync database:", error);
    process.exit(1);
  }
};

syncDatabase();

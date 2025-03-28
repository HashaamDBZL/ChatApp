const { Sequelize } = require("sequelize");
const { User } = require("./models/User"); // Adjust path if needed
const { Chat } = require("./models/Chat"); // Adjust path if needed
const { Message } = require("./models/Message"); // Adjust path if needed

const sequelize = new Sequelize(
  "postgres://postgres:admin@localhost:5432/Chat"
);
const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected...");

    await sequelize.sync({ force: true }); // This will drop and recreate all tables
    console.log("✅ Tables recreated.");

    // Insert Users
    const users = await User.bulkCreate(
      [
        {
          name: "Albert Einstein",
          image:
            "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTseI-YaVjLJHwgKC9kCuk195wy1_w40g-FGqrFLZMeRuM8XYGJ-rqFgQX5RPrx_CcD-cIiddkjZIekbd18LLT53aHMm2Br7EGro21MIw",
          about: "Theoretical Physicist",
          number: "19009909991",
        },
        {
          name: "Steve Jobs",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpav1iIAD5EfBHc-QxBecROMSg5a8jouIN5Q&s",
          about: "A Tech Inventor",
          number: "19999999991",
        },
        {
          name: "Thomas Edison",
          image:
            "https://cdn.britannica.com/55/79855-159-1C729E45/Thomas-Alva-Edison-man.jpg",
          about: "A Copycat",
          number: "00000111111",
        },
        {
          name: "Nikola Tesla",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbPP_9NLRql-UrrXa0vxWq_8r88jV120aCfw&s",
          about: "A Genius",
          number: "00000000000",
        },
        {
          name: "Christiano Ronaldo",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF8CYve4Ez3r5zBUWhNL_vuO9P2syDULltnQ&s",
          about: "A footballer",
          number: "03116370670",
        },
      ],
      { ignoreDuplicates: true }
    );

    console.log("✅ Users seeded successfully.");

    // Fetch users by ID to use in chats
    const user1 = users[0]; // Albert Einstein
    const user2 = users[1]; // Steve Jobs
    const user3 = users[2]; // Thomas Edison
    const user4 = users[3]; // Nikola Tesla

    // Insert Chats
    const chats = await Chat.bulkCreate([
      {
        user1Id: user1.id,
        user2Id: user2.id,
      },
      {
        user1Id: user1.id,
        user2Id: user3.id,
      },
      {
        user1Id: user1.id,
        user2Id: user4.id,
      },
    ]);

    console.log("✅ Chats seeded successfully.");
    console.log(chats);

    // Fetch chat IDs
    const chat1 = chats[0]; // Chat between Albert Einstein & Steve Jobs
    const chat2 = chats[1]; // Chat between Albert Einstein & Thomas Edison
    const chat3 = chats[2]; // Chat between Albert Einstein & Nikola Tesla

    // Insert Messages
    await Message.bulkCreate([
      {
        chatId: chat1.id,
        senderId: user1.id,
        recieverId: user2.id,
        messageContent: "Hey Steve, ever thought about relativity?",
      },
      {
        chatId: chat1.id,
        senderId: user2.id,
        recieverId: user1.id,
        messageContent: "Relativity is cool, but have you seen the iPhone?",
      },
      {
        chatId: chat2.id,
        senderId: user1.id,
        recieverId: user3.id,
        messageContent:
          "Edison, why did you take credit for so many inventions?",
      },
      {
        chatId: chat2.id,
        senderId: user3.id,
        recieverId: user1.id,
        messageContent: "It's called business, my friend!",
      },
      {
        chatId: chat3.id,
        senderId: user1.id,
        recieverId: user4.id,
        messageContent: "Nikola, you were ahead of your time!",
      },
      {
        chatId: chat3.id,
        senderId: user4.id,
        recieverId: user1.id,
        messageContent: "Thanks, Albert. But AC power is the real revolution!",
      },
    ]);

    console.log("✅ Messages seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await sequelize.close();
    console.log("✅ Database connection closed.");
  }
};

seedDatabase();

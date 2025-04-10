const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.ts");
const socketIO = require("socket.io");
const http = require("http");
const { redisSubscriber } = require("./config/redis.js");
const passport = require("./config/passport"); // Import Passport configuration
const session = require("express-session"); // For session management
const {
  markMessagesAsDelivered,
  markMessagesAsRead,
} = require("./controllers/messageController.js");
const { onlineUsers, userCurrentChats } = require("./utils.js");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // secure: true, // Enable in production if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Example: 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/chats", authMiddleware, chatRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // adjust as needed
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    io.of("/").adapter.rooms;
  });

  socket.on("user_online", async (userId) => {
    try {
      onlineUsers.set(userId, socket.id);
      await markMessagesAsDelivered(userId, io);
    } catch (error) {
      console.error("Error marking messages as delivered on login:", error);
    }
  });

  socket.on("chat_opened", async ({ chatId, userId }) => {
    try {
      await markMessagesAsRead(chatId, userId, io);
      userCurrentChats.set(userId, chatId);
    } catch (err) {
      console.error("Failed to mark messages as read:", err);
    }
  });

  socket.on("chat_closed", ({ chatId, userId }) => {
    // Clean up the chat state
    if (userCurrentChats.get(userId) === chatId) {
      userCurrentChats.delete(userId);
    }
  });

  // User logs out
  socket.on("user_logout", (userId) => {
    if (onlineUsers.get(userId)) {
      onlineUsers.delete(userId);
    }

    if (userCurrentChats.get(userId)) {
      userCurrentChats.delete(userId);
    }
  });

  // Cleanup when user disconnects
  socket.on("disconnect", () => {
    // If the user was in a chat, remove them from the current chat and online users
    for (let userId of onlineUsers.keys()) {
      if (onlineUsers.get(userId) === socket.id) {
        // Handle logout logic for disconnected user
        onlineUsers.delete(userId);

        if (userCurrentChats.get(userId)) {
          userCurrentChats.delete(userId);
        }
        break;
      }
    }
  });
});

redisSubscriber.subscribe("chat_channel");
redisSubscriber.on("message", (channel, message) => {
  const parsedMessage = JSON.parse(message);

  // Emit to both sender and receiver
  io.to(`user_${parsedMessage.senderId}`).emit("new_message", parsedMessage);
  io.to(`user_${parsedMessage.recieverId}`).emit("new_message", parsedMessage);
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

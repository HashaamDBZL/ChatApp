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

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
  console.log("🔌 User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

redisSubscriber.subscribe("chat_channel");
redisSubscriber.on("message", (channel, message) => {
  const parsedMessage = JSON.parse(message);

  // Emit to both sender and receiver
  io.to(`user_${parsedMessage.senderId}`).emit("new_message", parsedMessage);
  io.to(`user_${parsedMessage.recieverId}`).emit("new_message", parsedMessage);
  console.log(
    "📡 Emitting to rooms:",
    parsedMessage.senderId,
    parsedMessage.recieverId
  );
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

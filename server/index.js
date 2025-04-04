const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const authMiddleware = require("./middleware/authMiddleware.ts");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/chats", authMiddleware, chatRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

 const onlineUsers = new Map(); // userId -> socketId
 const userCurrentChats = new Map(); // userId -> currentlyOpenedChatId

module.exports = { onlineUsers, userCurrentChats };

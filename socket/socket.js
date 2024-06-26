const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let users = [];

const addUsers = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (data) => {
    addUsers(data.userId, socket.id);
  });

  socket.on("setMessage", (msg) => {
    const receiverSocketId = users.filter(
      (user) => user.userId === msg.receiverId
    );
    io.to(receiverSocketId.socketId).emit("getMessage", msg);
  });

  socket.on("isTyping", ({ isTyping, receiverId }) => {
    const receiverSocketId = users.filter((user) => user.userId === receiverId);
    io.to(receiverSocketId.socketId).emit("userIstyping", isTyping);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(80, () => {
  console.log("Server is running on port 80");
});

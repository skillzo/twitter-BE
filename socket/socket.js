const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

let users = [];

const addUsers = (userId, socketId) => {
  !users.some((user) => user.id === userId) && users.push({ userId, socketId });
};

io.on("connection", (socket) => {
  console.log("a user connected", socket);
  socket.on("addUser", (data) => {
    addUsers(data.userId, socket.id);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

console.log("users", users);

server.listen(80, () => {
  console.log("Server is running on port 80");
});

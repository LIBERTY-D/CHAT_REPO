const express = require("express");
const socket = require("socket.io");
const moment = require("moment");
const http = require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);
const io = socket(server);

app.use(express.static(`${path.join(__dirname, "../FRONTEND/")}`));

let users = [];
const sendfilteredUsers = (user) => {
  return users.filter((currentUser) => currentUser.group === user.group);
};
io.on("connection", (socket) => {
  socket.emit("visit", {
    username: "Admin",
    message: "Welcome to Pychat",
    time: moment().format("h:m a"),
  });

  socket.on("user", (user) => {
    // group
    socket.join(user.group);

    const newUser = { id: socket.id, ...user, time: moment().format("h:m a") };
    users.push(newUser);
    socket.broadcast.to(user.group).emit("visit", {
      username: "Admin",
      message: `${newUser.username} has join the chat `,
      time: moment().format("h:m a"),
    });
    // send everyUser thats joins on front end
    io.to(user.group).emit("users", sendfilteredUsers(user));
  });
  socket.on("message", (message) => {
    const user = users.find((user) => user.id === socket.id);
    // console.log(user);
    const userMessage = {
      username: user.username,
      message: message,
      time: moment().format("h:m a"),
    };
    io.to(user.group).emit("message", userMessage);
  });

  socket.on("disconnect", () => {
    // const userLeft = user
    const userLeft = users.filter((user) => user.id == socket.id);
    if (userLeft.length === 0) {
      return "Gone";
    }
    if (userLeft) {
      io.to(userLeft[0].group).emit("visit", {
        username: "Admin",
        message: `${userLeft[0].username} has left the chat`,
        time: moment().format("h:m a"),
      });
      users = users.filter((user) => user.id !== socket.id);
      io.to(userLeft[0].group).emit("users", sendfilteredUsers(userLeft[0]));
    }
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

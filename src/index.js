const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
// const { isObject, callbackify } = require("util");
const { genrateMessage, genrateLocation } = require("./utils/messages");
const {getUser, addUser , removeUser , getUserInRoom } = require("./utils/users")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, "../public");

app.use(express.static(publicDirectory));



io.on("connection", (socket) => {
  console.log("New WebSocket connection");


  socket.on('join',({username,room} , callback) =>{
    const {error , user} =  addUser({id: socket.id,username,room})
    if(error)
    {
      return callback(error)
    }
    socket.join(room)
    socket.emit("message", genrateMessage('Admin','Welcome'));
    socket.broadcast.to(room).emit("message", genrateMessage('Admin',`${user.username} has joined!`));
    io.to(user.room).emit('roomData',{
      room:user.room,
      users:getUserInRoom(user.room)
    })
    callback();
  })

  socket.on("sendMessage", (message, callback) => {
    const user  = getUser(socket.id)
    io.to(user.room).emit("message", genrateMessage(user.username,message));
    callback();
  });
  socket.on("sendLocation", (coords, callback) => {
    const user  =  getUser(socket.id)

    io.to(user.room).emit(
      "locationMessage",
      genrateLocation(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user  = removeUser(socket.id)
    if(user)
  {
    io.to(user.room).emit(
      "message",
      genrateMessage("Admin",`${user.username} has left!`)
    );
    io.to(user.room).emit('roomdata',{
      room: user.room,
      users:getUserInRoom(user.room)
    })
  }

  });
});

// io.on("connection", (socket) => {
//   console.log("New Web Socket connection");
//   socket.emit("message", "welcome");
//   socket.broadcast.emit("message", "A new user is join")

  
//   socket.on("sendmessage", (message,callback) => {
//     io.emit("message", message);
//     callback();
//   });

//   socket.on("sendLocation", (coords, callback) => {
//        io.emit("message",`https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
//        callback();
//       });

//   socket.on("disconnect",() =>{
//     io.emit("message", "user is left a chat");
//   })
// });

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});

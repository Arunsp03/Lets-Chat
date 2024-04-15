const express=require('express');
const socketio=require("socket.io")
const app=express();
//create a dictionary for the user arrays
let users={};
//Creating an express server

const expressserver=app.listen(8080,()=>{
    console.log("Listening on 8080");
});

//Creating the socket server

const io = new socketio.Server(expressserver, {
  cors:
  {
    origin:"*"
  }
});

io.on("connection", (socket) => {
    // console.log("connected");
    socket.on("message",(data)=>{
    // console.log("received data",data);
    // console.log("roomdet",data.roomform.roomname);
    io.to(data.roomform.roomname).emit("responsemessage",data);
 })

 //entering a room

 socket.on("roomdetails",(data)=>{
  console.log("roomdata",data);
  const{username,room,storedroom}=data;
  socket.join(room)
  
  // console.log(room,"roomname");
  // console.log(storedroom,"storedroom");
  //Check if an array for the room exists in the dictionary
  if(!users[room])
  {
    users[room]=[];
  }
  users[room].push(username)
//  console.log("users",users);
  io.to(room).emit("userlist",users[room])
  io.to(room).emit("join",username)

 })
 
 //rejoining a room while refreshing

 socket.on("rejoinonrefresh",(data)=>{
  const{username,roomname}=data;
  socket.join(roomname)

  io.to(roomname).emit("userlist",users[roomname])  
  
 })

 //User leaves a room

 socket.on("leaveroom",(data)=>{
  // console.log("leaveroom ",data);
  const {username,room}=data
  socket.leave(room);
let updated_users=users[room].filter((item)=>item!=username);
  io.to(room).emit("userleft",username);
  io.to(room).emit("userlist",updated_users)
 })

//Typing
 socket.on("activity",(data)=>{
  socket.broadcast.to(data.roomname).emit("type",data.username)
 })
});


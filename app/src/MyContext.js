import React, { createContext,useState } from 'react';
import { io } from 'socket.io-client';


export const MyContext = createContext();

// Create a provider component
export const MyContextProvider = ({ children }) => {
  //Socket connection
  const socketconn = io("http://localhost:8080/");
  //Roomname details
  const [roomform,setRoomForm]=useState({
    "username":sessionStorage.getItem("username")?sessionStorage.getItem("username"):"",
    "roomname":sessionStorage.getItem("room")?sessionStorage.getItem("room"):""
})

  const contextValue = {
    socketconn,
    roomform,
    setRoomForm
  };

  
  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};
import React  from 'react'
import "../ComponentStyles/Rooms.css"
import { useContext } from 'react';
import { MyContext } from '../MyContext';
import { useNavigate } from "react-router-dom";
export default function Room() {
  const navigate = useNavigate();
const {socketconn}=useContext(MyContext);
    const{roomform,setRoomForm}=useContext(MyContext)
    function updateform(e){
      const {name,value}=e.target;
      setRoomForm({
        ...roomform,
        [name]:value
      })
    }
    function submitroom(e){
      e.preventDefault();
      //setting session values
      sessionStorage.setItem("room", roomform.roomname);
      sessionStorage.setItem("username",roomform.username)
      let data={
        username:roomform.username,
        room:roomform.roomname,
        storedroom:sessionStorage.getItem("room")
      }
      socketconn.emit("roomdetails",data);
      navigate("/chatroom");
      
    }
  return (
<div className='chatcontainer'>
<h1>Room Details</h1>
<form id="roomform">
    <label htmlFor='username'>Enter User Name  </label>
    <input type='text' id="username" name='username' value={roomform.username} onChange={updateform} required/>
    <label htmlFor='roomname'>Enter Room Name  </label>
    <input type='text' id='roomname' name='roomname' value={roomform.roomname} onChange={updateform} required/>
    <button id="room-submit-btn" onClick={(e)=>submitroom(e)}>Join</button>
</form>
</div>
  )
}

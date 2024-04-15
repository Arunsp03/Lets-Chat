import React, { useContext, useEffect, useState } from 'react'
import "../ComponentStyles/ParticipantList.css"
import { MyContext } from '../MyContext'
import { SlUser } from "react-icons/sl";
import { useNavigate } from "react-router-dom";
export default function Participantslist() {
  const navigate = useNavigate();
  const[participants,SetParticipants]=useState([])
  const {socketconn,setRoomForm}=useContext(MyContext)
  useEffect(()=>{
socketconn.on("userlist",(data)=>{
  SetParticipants(data);
})
  },[socketconn])

  //leave functionality

  function leaveroom(){
    const username=sessionStorage.getItem("username");
    const room=sessionStorage.getItem("room");
    const data={username,room}
    // console.log("sending room",room);
    socketconn.emit("leaveroom",data);
    sessionStorage.clear();
    setRoomForm(
      {
        "username":"",
        "roomname":""
    }
    )
   navigate("/")
  }
  return (
    
    <div className='participants'>
      <div className='User-info'>
      <SlUser /> 
      <span> {sessionStorage.getItem("username")}</span>
      </div>
     <h2 className='participant-header'>Participants</h2>
     {participants.map((item,index)=>{
      return <p key={index} className='Participant'>{item}</p>
     })}
     <button onClick={()=>leaveroom()} className='leave-room-btn' id='leave-room-btn'>Leave Room</button>
    </div>
  )
}

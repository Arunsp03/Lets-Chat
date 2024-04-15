import React from 'react'
import { useEffect } from 'react';
import { MyContext } from '../MyContext';
import "../ComponentStyles/Chat.css"
import { useContext } from 'react';
export default function Chat() {
  
    const { socketconn,roomform} = useContext(MyContext);
    //sending messages
    function sendmessage(e){
        e.preventDefault();
        let message=document.getElementById("userMessage").value
        document.getElementById("userMessage").value=""
        socketconn.emit("message",{message,roomform});
      }

  
    useEffect(() => {
      const username=sessionStorage.getItem("username")
      const roomname=sessionStorage.getItem("room")
      const roomdata={username,roomname}
  //event listener for typing
  document.getElementById("userMessage").addEventListener("keypress", () => {
    socketconn.emit("activity", {username,roomname});
  });
      //Joining room even incase of refresh of the page

      if(username!=='' && roomname!=='')
      {
        // console.log("refreshed and joined")
        socketconn.emit("rejoinonrefresh",roomdata);
      }
      
        const chatbox = document.getElementById("chatbox");
        document.getElementById("userMessage").value=""

        //for handling chat messages

        const handleResponseMessage = (data) => {
            let chatElement = document.createElement("p");
            if(username===data.roomform.username){
              chatElement.textContent ="You : "+data.message;
            }
            else{
            chatElement.textContent = data.roomform.username+" : "+data.message;
            }
            if(data.roomform.username===username)
            {
              chatElement.classList.add("my-chat");

            }
            else{
              chatElement.classList.add("other-chat");
            }
            //Showing the time for each message
            let timeelement=document.createElement("span")
            timeelement.textContent=new Date().toTimeString().substring(0,8); 

            timeelement.classList.add("time")
            chatElement.appendChild(timeelement)
            chatbox.append(chatElement);

            //scrolling to the bottom in case of overflow

            chatbox.scrollTop=chatbox.scrollHeight
            document.getElementById("typing").textContent=''
            

        };
        //for new users joining
        socketconn.on("join",(data)=>{
          let chatElement = document.createElement("p");
          if(username===data)
          {
            chatElement.textContent="You have joined the room"
          }
          else{
            chatElement.textContent=data+" has joined the room"

          }
          chatElement.classList.add("joined-user")
          chatbox.append(chatElement)
          
          chatbox.scrollTop=chatbox.scrollHeight
        })
        //for users leaving the room
        socketconn.on("userleft",(data)=>{
          let chatElement = document.createElement("p");
          chatElement.textContent=data+" has left the room"
          chatElement.classList.add("joined-user")
          chatbox.append(chatElement)
          chatbox.scrollTop=chatbox.scrollHeight
        })

         //for showing typing
       socketconn.on("type",(data)=>{
        document.getElementById("typing").textContent=data+" is typing..."
        //for  showing typing for only limited time - 10s
        setTimeout(() => {
          // console.log("over");
          if(document.getElementById("typing"))
          {
            document.getElementById("typing").textContent=''  
          }
         }, 10000);
       })

        socketconn.on("responsemessage", handleResponseMessage);
       
        return () => {
          socketconn.off("activity")
          socketconn.off("userleft");
          socketconn.off("join");
          socketconn.off("responsemessage", handleResponseMessage);
        };
    }, [socketconn]);

  return (
    <div className='chat'>
       <h1 className='chat-header'>Welcome to {sessionStorage.getItem('room')}</h1>
       <div id="chatbox">
      </div>
      <div className='typing' id="typing">
      
      </div>
      <div className='message-section'>
      <form>
      <label htmlFor="userMessage" >Send</label>
      <input  type='text' placeholder='Type your message and hit enter...' name="userMessage" id="userMessage"/>
      <button onClick={(e)=>sendmessage(e)}  name="send-btn" id="send-btn">Send</button>
      </form>
      </div>
    </div>
  )
}

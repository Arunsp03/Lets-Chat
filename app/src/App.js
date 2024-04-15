
import { MyContext } from './MyContext';
import { useEffect } from 'react';
import "../src/App.css"
import Landing from './Components/Landing';
import Room from './Components/Room';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Participantslist from './Components/Participantslist';
import { useContext } from 'react';
export default function App(){
const {socketconn}=useContext(MyContext)
useEffect(() => {
  // Establish socket connection when component mounts
  console.log('Connecting to socket server...');
  socketconn.connect();

  // Clean up function to close socket connection when component unmounts
  return () => {
    console.log('Disconnecting from socket server...');
    socketconn.disconnect();
  };
}, [socketconn]);

  

  return (
    <BrowserRouter >
   
      <Routes>
        <Route path="/"  element={<Room/>} /> 
      </Routes>
      <Routes>
        <Route path="/chatroom"  element={
        <div className='Landing'>
          <Participantslist/>
          <Landing/>
        </div>
        } /> 
      </Routes>
   
    </BrowserRouter> 
     
   
  );
  }


import React, { useState, useEffect} from "react";
import logo from './caLogo.png';
import fileIcon from './fileicon.png'
import './App.css';
import { io } from "socket.io-client";



const socket = io('http://localhost:8000')

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [joinState, setJoinState] = useState(false);
  const [sessionID, setSessionID] = useState("");
  const [currentRoom, setCurrentRoom]= useState("");
  const [currentMessage, setCurrentMessage]= useState("");
  const [messageList, setMessageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [tempFile, setTempFile] = useState({});

  

  useEffect(() => {
    socket.on("receive-message", message =>{
      printMessage(message);
    });
    socket.on("load-file", (fileMeta)=>{
      printFile(fileMeta);
    })
  }, [socket]);
 
  const makeRandomSession= () =>{
    const rand = generateSessionID();
    joinSession(rand);
    setCurrentRoom(rand);
  }
  const generateSessionID = () => {
    const rand = Math.random().toString(16).substr(2, 8);
    return rand;
  }
  const joinSession = (room) => {

      setCurrentRoom(sessionID);
      socket.emit("join-room", room);
      setIsLoggedIn(true);
  }
  const setDesiredSession = () =>{
    const temp = sessionID;
    setCurrentRoom(temp);
    joinSession(temp);

  }

  const closeSession = () => {
    setMessageList([]);
    setFileList([]);
    setCurrentRoom("");
    setIsLoggedIn(false);
  }

  const dropdownHandler = (event) =>{
    const button = event.target;
    if(joinState === false){ 
      setJoinState(true);
      button.innerHTML = "x"

      
    }else{
      setJoinState(false)
      button.innerHTML = "Join Session"
    }
  }
  const sendMessage = () => {
    
    socket.emit("send-message", currentMessage, currentRoom)
    printMessage(currentMessage)
    setCurrentMessage("")
  }
  const sendFile = () => {
    socket.emit("send-file",tempFile, currentRoom)
    printFile(tempFile);
    setTempFile({});
  }
  const printMessage = (message) => {
    setMessageList((prevMessageList) => {
      return [...prevMessageList, {value:message, id:Math.random().toString()}]
      
    });
    console.log("ping");
  }
  const printFile = (fileMeta) => {
    setFileList((prevFileList)=> {
      return [...prevFileList, {name:fileMeta.name, size: fileMeta.size, id:Math.random().toString()}]
    });
  }
  return (
    <div className="App">
        
        <div className='main-body'>
          {isLoggedIn ? <>
          <div className="container">
            <h1>Text</h1>
             <div className="data-container">
                <div className="message-container">
                  {messageList.map((message)=> (
                      <div key={message.id} className='message-card'>
                        <div className="text-box">{message.value}</div>
                        <button className="cpy-btn" onClick={() => {navigator.clipboard.writeText(message.value)}}>Copy</button></div>
                  ))}
              </div>
              <div className="message-input-container">
                  <input type="text" placeholder="Message" onChange={(e) => {
                    setCurrentMessage(e.target.value)
                  }} />
                  <button className="send-btn" onClick={sendMessage} > Send </button>
                </div>
             </div>
             
          </div>
          <div className="container">
          <h1>Join</h1>
            <div className="join-container">
              <h1>Session ID: {currentRoom}</h1>
              <div className="qr-container">
              <img src=" https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://www.youtube.com/channel/UC2dyEbr5_wjiQsjHhyrnzwA"/>
              </div>
              
            </div>
            <div onClick={closeSession} className="close-session-btn">Close Session</div>
          </div>

          <div className="container">
          <h1>Files</h1>
            <div className="data-container">
              <div className="file-box">
                {fileList.map((file)=> (
                  <div key={file.id} className="file-container">
                  <img src={fileIcon} alt="File"></img>
                  <p>{file.name}</p>
                  </div>
                ))}
              </div>
              <div className="message-input-container">
                  <input type="text" placeholder="FileName" onChange={(e) => {
                    
                  }} />
                  <button className="send-btn" onClick={sendFile} > Send </button>
                </div>
                <input onChange={(e)=> {
                  setTempFile(e.target.files[0])
                  
                }}
                  type="file"
                  id="docpicker"
                  accept=".png, .jpg, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            </div>
          </div>
          </> 
          
          
          : <div>
            
             <div onClick={makeRandomSession} className='new-session-btn'>Begin New Session</div></div> }
          
        </div>
        

    </div>
  );
}

export default App;
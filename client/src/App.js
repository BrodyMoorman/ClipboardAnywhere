import React, { useState, useEffect } from "react";
import logo from './caLogo.png';
import fileIcon from './fileicon.png'
import uploadIcon from './uploadIcon.png'
import TextCard from "./components/text/TextCard";
import './App.css';
import { io } from "socket.io-client";
import {useParams} from "react-router-dom"



const socket = io('http://localhost:8000')


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [joinState, setJoinState] = useState(false);
  const [sessionID, setSessionID] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [tempFile, setTempFile] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const {roomID} = useParams();
  if(roomID){
    setCurrentRoom(roomID)
    setIsLoggedIn(true);
  }

  useEffect(() => {
    socket.on("receive-message", message => {
      printMessage(message);
    });
    socket.on("load-file", (fileMeta) => {
      console.log(fileMeta);
      printFile(fileMeta);
    })
  }, [socket]);

  const makeRandomSession = () => {
    const rand = generateSessionID();
    joinSession(rand);
    setCurrentRoom(rand);
    setIsOwner(true);
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
  const setDesiredSession = () => {
    const temp = sessionID;
    setCurrentRoom(temp);
    joinSession(temp);

  }

  const closeSession = () => {
    socket.emit("leave-room",currentRoom);
    socket.emit("close-room", currentRoom, isOwner);
    setDataList([]);
    setIsOwner(false);
    setCurrentRoom("");
    setIsLoggedIn(false);
  }

  const dropdownHandler = (event) => {
    const button = event.target;
    if (joinState === false) {
      setJoinState(true);
      button.innerHTML = "x"


    } else {
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
    socket.emit("upload", tempFile, currentRoom, tempFile.name, (status) => {
      console.log(status);
    });
    printFile(tempFile);
    console.log(tempFile)
    setTempFile(null);
  }
  const printMessage = (message) => {
    setDataList((prevMessageList) => {
      return [...prevMessageList, { type: "text", value: message, id: Math.random().toString() }]

    });
    console.log("ping");
  }
  const printFile = (fileMeta) => {
    if(fileMeta===null) return
    setDataList((prevFileList) => {
      return [...prevFileList, { type: "file", name: fileMeta.name, size: fileMeta.size, id: Math.random().toString() }]
    });
    
  }
  const checkCurrentFile = () => {
    console.log(tempFile)
  }
  const removeCurrentFile = () => {
    setTempFile(null)
  }
  const forcePrintFile = () => {
    printFile(tempFile)
    
    setTempFile(null)
  }
  return (
    <div className="App">
      

      {isLoggedIn ?
        <div>
          <div className='main-body'>
            <div className="left-bar">
              <img src={logo} alt="logo" className="logo" />
              <div className="join-container">
                {isOwner && <h1 className="is-owner">Session Creator</h1>}
                <h1>Session ID: {currentRoom}</h1>
                <div className="qr-container">
                  <img alt="QR Code" src=" https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://www.youtube.com/channel/UC2dyEbr5_wjiQsjHhyrnzwA" />
                </div>

              </div>
              <div onClick={closeSession} className="close-session-btn">Close Session</div>
            </div>
            <div className="container">
              
              <div className="data-container">
                <div className="message-container">
                  {dataList.map((message) => 
                    <TextCard
                    type={message.type}
                    key={message.id}
                    value={message.value}
                    name={message.name}
                    room={currentRoom}
                    />
                  )}
                </div>
                {tempFile && <div onClick={sendFile} className="file-buffer-box">
                  <p>{tempFile.name}</p>
                  <p>Send?</p>
                </div>}
                <div className="message-input-container">
                  <input type="text" placeholder="Message" onChange={(e) => {
                    setCurrentMessage(e.target.value)
                  }} />
                  <button className="send-btn" onClick={sendMessage} > Send </button>

                  <div>
                  <label htmlFor="docpicker">
                  <img src={uploadIcon} alt="file-icon"/>
                    <input onChange={(e) => {
                      setTempFile(e.target.files[0])
                      

                    }}
                      type="file"
                      id="docpicker"
                      accept=".png, .pdf, .jpg, .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                  </label>
                  </div>
                  
                  
                </div>
              </div>
              
              
            </div>

          </div>

        </div>


        : <div>
          <div className="Topbar">
            <img src={logo} alt="logo" className="logo" />
            <div className='nav-link'>
              {joinState ? <>
                <div className="join-session">
                  <input
                    className="id-input"
                    type="text"
                    placeholder="Session ID"
                    onChange={(e) => {
                      setSessionID(e.target.value);
                    }} />
                  <button className="id-button" onClick={setDesiredSession}> Join </button>
                </div>
              </> : <p className="join-session-btn" onClick={dropdownHandler}>Join Session</p>}

            </div>
          </div>
          <div className='main-body'>
            <div onClick={makeRandomSession} className='new-session-btn'>Start</div>
          </div>
        </div>
      }



    
    </div>
  );
}

export default App;
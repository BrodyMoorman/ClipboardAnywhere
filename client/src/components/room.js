import React from 'react'
import TextCard from './text/textCard'

function Room() {
    return(<div>
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

      </div>)
};

export default Room;
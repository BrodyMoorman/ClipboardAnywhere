import React from 'react'
import downloadIcon from './downloadIcon.png'
import copyIcon from './copyIcon.png'
import FileDownloader from './FileDownloader';

function TextCard(props){
    
    const roomDir = "http://localhost:8000/uploads/"+ props.room + "/";
    if(props.type === "text"){
        return(
        <div key={props.id} className='message-card'>
            <div className="text-box">{props.value}</div>
            <img onClick={(e) => { 
                navigator.clipboard.writeText(props.value)
                e.target.innerHTML = "copied"
             }}
                 src={copyIcon} alt="copy"></img>
        </div>
        )
    }
    return(
        <div key={props.id} className='file-card'>
            <div className="text-box">{props.name}</div>
            <FileDownloader fileUrl={roomDir + props.name} fileName={props.name} />
        </div>
    )
}
export default TextCard;
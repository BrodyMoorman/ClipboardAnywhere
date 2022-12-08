const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors");
const cron = require("node-cron");
 
app.use(cors());
const server = http.createServer(app)
app.use(express.static('tmp'))
const schedule = '* * * * *';

cron.schedule(schedule,()=> {
    const directory = './tmp/uploads/';

    // Set the time limit for deleting subdirectories (in milliseconds)
    const timeLimit = 5 * 60 * 1000; // 5 minutes
    console.log("running dir check at "+ Date.now())
    // Read the contents of the directory
    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err.message}`);
        return;
      }
    
      // Loop through the files and check if they are subdirectories
      files.forEach((file) => {
        const filePath = path.join(directory, file);
    
        // Check if the file is a directory
        fs.stat(filePath, (statErr, stats) => {
          if (statErr) {
            console.error(`Error reading file stats: ${statErr.message}`);
            return;
          }
    
          if (stats.isDirectory()) {
            // Check if the directory was created more than 5 minutes ago
            if (Date.now() - stats.ctimeMs > timeLimit) {
              // Delete the directory
              fs.rm(filePath,{ recursive: true, force: true }, (rmdirErr) => {
                if (rmdirErr) {
                  console.error(`Error deleting directory: ${rmdirErr.message}`);
                } else {
                  console.log(`Deleted directory: ${filePath}`);
                }
              });
            }
          }
        });
      });
    });
})
const io = new Server(server, {
    cors:{
        
        origin: ["http://localhost:3000"],
        methods: ["GET","POST"],
       
    },
})
io.on('connection', socket => {
    console.log(socket.id)
    socket.on("send-message", (message, room) =>{
        console.log(`Message: ${message} Room: ${room}`)
        socket.to(room).emit("receive-message", message)
    
    })
    socket.on('join-room', (room) =>{
        const uploadDir = './tmp/uploads/'
        if (!fs.existsSync(uploadDir + room)) {
            fs.mkdirSync(uploadDir + room);
          }
        socket.join(room)
        console.log(`ID:${socket.id} joined ${room}`)
    })
    socket.on("send-file",(fileMeta, room) => {  
        //upload file to destination
        //name the file
        console.log(fileMeta);
        socket.to(room).emit("load-file", fileMeta)
    })
    socket.on("upload", (file, room, fileName, callback) => {
        console.log(file); // <Buffer 25 50 44 ...>
    
        // save the content to the disk, for example
        fs.writeFile("./tmp/uploads/"+ room + "/" + fileName, file, (err) => {
          callback({ message: err ? "failure" : "success" });
          if(err){
            console.log(err)
          }
        });
        const fileMeta = {name:fileName, size: 1}
        socket.to(room).emit("load-file", fileMeta )
      });
    socket.on("close-room", (room, isOwner) =>{
        
        if(isOwner){
        const uploadDir = './tmp/uploads/'
            fs.rm((uploadDir+room), { recursive: true, force: true }, err => {
                if (err) {
                throw err;
                }

            });
        }  
    })
})

server.listen(8000, () =>{
    console.log("server is running")
})
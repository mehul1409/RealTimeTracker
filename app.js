const express = require('express')
const path = require('path')
const http = require('http');
const app = express();

const socketio = require('socket.io');
// socketio runs on http server!

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.get('/',(req,res)=>{
    res.render("index");
})

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data})
    });

    socket.on("disconnect",function(){
        io.emit("user-disconnect",socket.id)
    })
})

server.listen(5000,(err)=>{
    if(err){
        console.log(`error : ${err}`);
    }else{
        console.log("Server successfully started!");
    }
});

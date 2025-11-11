import dotenv from 'dotenv'
dotenv.config() ;
import {Server} from 'socket.io' ;
import http from 'http' ;
import express from 'express' ;




const app = express() ;


const server = http.createServer(app) ;

const io = new Server( server , {
    cors : {
        origin : process.env.CLIENT_URL ,
        credentials: true ,
    }
}) ;

const onlineUsersMap = {} ;
io.on("connection" , (Socket)=>{
    if(!Socket.handshake.query._id) return ;
    onlineUsersMap[Socket.handshake.query._id] = Socket.id ;
    console.log(onlineUsersMap);
    if(!onlineUsersMap ) return ;

    console.log("only keys",Object.keys(onlineUsersMap));
    io.emit("onlineUsers" , Object.keys(onlineUsersMap) ) ;
    // onlineUsersMap = {} ;
   Socket.on("disconnect" , ()=>{
    delete onlineUsersMap[Socket.handshake.query._id] ;
        io.emit("onlineUsers" , Object.keys(onlineUsersMap) ) ;
   })


})


export { app , io , server , onlineUsersMap }

import { app , server } from './socket/socket.js'
// import dotenv from 'dotenv' ;
// dotenv.config() ;
import express from 'express' ;
import { userRouter } from './routes/user.route.js';
import { connectMongoDB } from './db/connection1.db.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { messageRouter } from './routes/message.route.js';
import cors from 'cors' ;


connectMongoDB() ;
//////////////////////////////////////////////////////////////////////////

app.use(express.json()) ;
app.use(cors()) ;
////////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 5000 ;

     


app.use('/api/v1/user' , userRouter ) ;
app.use('/api/v1/message' , messageRouter ) ;




app.use(errorMiddleware) ;




server.listen(port , ()=>{
    console.log("ur server is listning at port : " , port) ;
}) ;
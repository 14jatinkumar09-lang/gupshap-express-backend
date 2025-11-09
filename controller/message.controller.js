import { messageModel } from '../models/message.model.js'
import { conversationModel } from '../models/conversation.model.js'

import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import mongoose from 'mongoose';
import { io, onlineUsersMap } from '../socket/socket.js';

export const getSocketId = (userId) => {
    return onlineUsersMap[userId] ;
}

export const sendMessage = asyncHandler( async(req,res,next)=> {
    
    const senderId = req._id ;
    const receiversId = req.query.receiversId ;
    
    const messages = req.body.message ;

    if(!senderId || !receiversId || !messages ) {
        return next(new errorHandler("all info required to send message" , 400)) ;
        
    }
    let conversation = await conversationModel.findOne({
        participants : {$all : [senderId , receiversId ]} ,
    })
    if(!conversation) {
        conversation = await conversationModel.create({
            participants : [senderId,receiversId] ,
        }) 
    }

    const newMessage = await messageModel.create({
        senderId,receiversId,messages
    })
    
      await conversationModel.findByIdAndUpdate(
  conversation._id,
  { 
    $push: { messages: newMessage._id },
    updatedAt: new Date() // force-update timestamp
  }
);


const socketId = getSocketId(receiversId) ;

console.log("msg : ",newMessage);
    const sender =  await userModel.findOne({_id : newMessage.senderId}) ;
    if(!sender) {
        return next(new errorHandler("server error " , 400)) ;
    }

    io.to(socketId).emit("message" , {
        message , sender
    }) ;

    //////socket.io /////////



    res.status(200).json({
        success : true , 
        responseData :  
            newMessage
        
    })
})
export const getMessage = asyncHandler(async(req,res,next) => {
    const senderId = req._id;
const receiversId = req.query.receiversId;

const messages = await messageModel.find({
  $or: [
    { senderId, receiversId },                      // me → other
    { senderId: receiversId, receiversId: senderId } // other → me
  ]
});

    // const conversation = await conversationModel.find({participants : {$all : [senderId , receiversId ]}});
    // if(!conversation) {
    //     return next(new errorHandler("internal server error" , 400 )) ;
    // }
    // const messages = conversation[0].messages.map((c)=>{
    //     return await  ;
    // })


    



    res.status(200).json({
        success  : false ,
        responseData : {
            messages ,
        }
    })

})

//////




///get messages


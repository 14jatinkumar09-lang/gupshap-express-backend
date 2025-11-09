import mongoose from "mongoose" ;


const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId ,
        required : true ,
        ref : 'User' ,
    } ,
    receiversId : {
        type : mongoose.Schema.Types.ObjectId ,
        required : true ,
    } ,
    messages : [{
        type : String ,
        required : true ,
    }] ,
} , {timestamps : true   }

)


export const messageModel = mongoose.model("Message" , messageSchema)

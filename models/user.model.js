import mongoose from 'mongoose'  ;

const userSchema = new mongoose.Schema({
    fullName : {
        type : String , 
        required : true 
    } ,
    gender : {
        type : String ,
        required : true
    } ,
    userName : {
        type : String ,
        unique : true
    } ,
    password : {
        type : String,
        required : true  ,
    } ,
    avatar : {
        type : String ,
    }
} , {timeStamps : true   }
)


export const userModel = mongoose.model("User" , userSchema ) ;
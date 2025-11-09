import mongoose from "mongoose";

export const connectMongoDB = async ()=>{
    
    try {
        const instance = await mongoose.connect(process.env.DB_STRING) ;
        console.log(instance.connection.host) ;
    } catch (error) {
        console.log("error",error) ;
    }
}

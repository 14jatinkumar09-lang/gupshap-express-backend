import { conversationModel } from "../models/conversation.model.js";
import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import bcrypt from 'bcrypt' ;
import jwt from 'jsonwebtoken' ;

export const register = asyncHandler (

    async (req,res ,next) => {
    
        const { fullName , userName , password , gender } = req.body ;
        if (!fullName || !password || !userName || !gender )  {
            return next( new errorHandler("all fields are required",400) ) ;
        }

        const user = await userModel.findOne({userName}) ;
        if(user) {

            return next(new errorHandler("User Already Exist" , 401)) ;
        }
        const hashedPassword = await bcrypt.hash( password , 10) ;
        const avatar = `https://avatar.iran.liara.run/public/${gender === "male" ?"boy" : "girl"}?username=${fullName}`
        
        const newUser = await userModel.create({
            fullName,userName,gender,password : hashedPassword ,avatar  
        })
        const data = {
        _id : newUser._id
    } ;
        
        const token = jwt.sign(data , process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE}) ; 

        res.status(200).json({
            success : true ,
            responseData : {
                message : "Account Created successfully! " ,
                newUser , token
            }
        })
    }

)


export const login = asyncHandler(async (req,res,next)=> {
    const { userName , password } = req.body ;

    if(!userName || !password) {
        return next(new errorHandler("all fields are required" , 400)) ;
    
    }
    const userExist = await userModel.findOne({userName}) ;
    if(!userExist) { 
        return next(new errorHandler("invalid userName or password" , 404)) ;
    }
    const validPassword = await bcrypt.compare(password , userExist.password) ;
    if(!validPassword) {
        return next(new errorHandler("invalid userName or password" ,400)) ;
    }
    const data = {
        _id : userExist._id
    } ;
    const token = jwt.sign(data, process.env.JWT_SECRET , {expiresIn : process.env.JWT_EXPIRE}) ;
    
 
    res.status(200).json({
        success : true , 
        responseData : {
            message : "logged in " ,
                userExist , token
        } ,

        })
     
    
})



export const getUser = asyncHandler(async(req,res,next) => {
    let userID = null ;
    if(req?.body?.selectedUserId) {
        userID =  req?.body?.selectedUserId ;
    }
    else {
        userID = req._id ;
    }

    const user = await userModel.findOne({_id : userID}) ;
    if(!user) {
        return next(new errorHandler("internal server error in get profile function / ni mila user" , 400)) ;
    }
    res.status(200).json({
        success : true , 
        responseData : {
            message : " on session  " ,
                user
        } ,

        })


} )




export const allOldUsers = asyncHandler(async(req,res,next)=>{
    const userId = req._id ;
    const arr = await conversationModel.find({participants : userId}).sort({ updatedAt: -1 });
    const ids = arr.map((c)=>{
        return c.participants.filter((user) => user != userId ) ;
    }) 
    const users = await userModel.find({
  _id: { $in: ids }
});
    
   
 
    if(!arr) {
        return next(new errorHandler("cant fetch all users",401)) ;
    }
    res.status(200).json({
    success : true , 
        responseData : {
            ids ,  users ,
                
        } ,

        })
})







export const updateUser = asyncHandler(async(req,res,next)=> {

    const userId = req._id ;
    const userDeatils = req.body ; 
    if(!userDeatils) {
        return next(new errorHandler("error hai saari details bhej bc", 401)) ;
    }
    if(userDeatils.userName) {
        const exist = userModel.findOne({userName : userDeatils.userName}) ;
        if(exist) {
            return next(new errorHandler(`This'${userDeatils.userName}' is Not Available ` , 402)) ;
        }
    }
    const update = await userModel.updateOne( {_id : userId} , {$set : userDeatils}) ;

    if(!update) {
        res.status(400).json({
            responseData : {
                success : false ,
                msg: "somethiing went wrong in the "
            }
        })
    }

    res.status(200).json({
        responseData : {
            success : true ,
            updatedUser : update ,
        }
    })

})







export const userFilterSearch = asyncHandler(async(req,res,next)=>{
     try {
        if(req.query.filter === "") return ;
    const filter = (req.query.filter || "").replace(/\s+/g, "").toLowerCase();

    const users = await userModel.aggregate([
      {
        $addFields: {
          normalizedUserName: { $replaceAll: { input: { $toLower: "$userName" }, find: " ", replacement: "" } },
          normalizedFullName: { $replaceAll: { input: { $toLower: "$fullName" }, find: " ", replacement: "" } }
        }
      },
      {
        $match: {
          $or: [
            { normalizedUserName: { $regex: filter } },
            { normalizedFullName: { $regex: filter } }
          ]
        }
      },
      {
        $project: { password: 0 } // hide password
      }
    ]);

    return res.status(200).json({
      responseData: { users }
    });

  } catch (error) {
    console.log("aagya error");
}
})
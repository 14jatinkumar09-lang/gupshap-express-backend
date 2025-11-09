import express from 'express' ;
import {  register,login, getUser , allOldUsers, updateUser, userFilterSearch } from '../controller/user.controller.js';
import {auth} from '../middlewares/auth.middleware.js'

export const userRouter = express.Router() ;

userRouter.post("/register" , register) ;

userRouter.post("/login" , login) ;


userRouter.post('/getUser' , auth , getUser ) ;

userRouter.post('/updateuserdeatils' , auth , updateUser ) ;

userRouter.get('/getallusers' , auth , allOldUsers ) ;

userRouter.get("/filterUserSearch" , auth , userFilterSearch ) ;







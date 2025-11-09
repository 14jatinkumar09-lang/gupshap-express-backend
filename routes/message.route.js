import express from 'express' ;
import {  getMessage, sendMessage } from '../controller/message.controller.js';
import {auth} from '../middlewares/auth.middleware.js'

export const messageRouter = express.Router() ;

messageRouter.post("/send-message" ,auth ,sendMessage) ;

messageRouter.get("/get-message" ,auth , getMessage) ;


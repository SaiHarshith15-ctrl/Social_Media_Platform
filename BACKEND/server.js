import exp from "express"
import {connect} from "mongoose"
import {commonApp} from "./APIs/commonApi.js"
import  cookieParser from 'cookie-parser'
import { postApp } from "./APIs/postApi.js"
import { likeApp } from "./APIs/likeApi.js"
import { notificationApp } from "./APIs/notificationApi.js"
import { followApp } from "./APIs/followApi.js"
import cors from 'cors'

const app=exp()
app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}))
async function  connectDB(){
    try{
        await connect("mongodb://localhost:27017/SocialMediaPlatform")
        console.log("DB connected sucessfully")
        
        // start server
        app.listen(3000,()=>console.log("server on port 3000..."))
    }catch (err){
        console.log("Error in connection:",err)
    }
}
connectDB()

app.use(exp.json())
app.use(cookieParser())
app.use("/auth",commonApp)
app.use("/posts",postApp)
app.use("/likes",likeApp)
app.use("/notification",notificationApp)
app.use("/user",followApp)

// Error handling middleware
app.use((err,req,res,next)=>{
    // ValidationError
    if(err.name==="ValidationError"){
        return res.status(400).json({message:"error occurred",error:err.message})
    }
    // CastError
    if(err.name==="CastError"){
        return res.status(400).json({message:"error occurred",error:err.message})
    }
    // send server side error
    res.status(500).json({message:"error occured",error:err.message})
})

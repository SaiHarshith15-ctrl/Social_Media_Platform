import exp from "express"
import {connect} from "mongoose"

const app=exp()
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

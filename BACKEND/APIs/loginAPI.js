import exp from "express"
import {compare,hash} from 'bcryptjs'
import {UserModel} from "../model/userModel.js"
import jwt from "jsonwebtoken"

export const loginApp=exp.Router()
const {sign} =jwt

// User Login
loginApp.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Email and Password is required"})
    }
    const user=await UserModel.findOne({email})
    if(!user){
        return res.status(404).json({message:"Email not found"})
    }
    const isMatched=await compare(password,user.password)
    if(!isMatched){
        return res.status(400).json({message:"Invaild password"})
    }

    const signtoken=sign(
        {
            id:user._id,
            email:email,
            firstName:user.firstname,
            lastName:user.lastname,
            // profileURL
        },
        "hufhigjfigjiof",
        {expiresIn:"2h"}

    )

    res.cookie("token",signtoken,{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    })
    res.status(200).json({message:"Login success"})
})
import exp from "express"
import {compare,hash} from 'bcryptjs'
import {UserModel} from "../model/userModel.js"
import jwt from "jsonwebtoken"
import { verifyToken } from "../middlewares/verifyToken.js"


export const commonApp = exp.Router()
const {sign} =jwt

// User registration
commonApp.post('/register',async(req,res)=>{
    const newuser = req.body
    const hashed = await hash(newuser.password,12)
    newuser.password = hashed
    const newuserdocument = new UserModel(newuser)
    newuser.password = hashed
    await newuserdocument.save()
    res.status(201).json({message:"user created"})
})


// User login
commonApp.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Email and Password is required"})
    }
    const user=await UserModel.findOne({email})
    if(!user || !user.isUserActive){
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
        sameSite:"none",
        secure:true
    })
    const userObj=user.toObject()
    delete userObj.password
    res.status(200).json({message:"Login success",payload:userObj})
})


////
// Check auth
commonApp.get("/check-auth", verifyToken(), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password')
    if (!user) return res.status(401).json({ message: "Not authenticated" })
    res.status(200).json({ payload: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// User Logout
commonApp.get("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"none",
        secure:true
    })
    res.status(200).json({message:"Logout success"})
})

// User profile soft deletion
commonApp.patch("/delete",verifyToken(),async(req,res)=>{
    const user =req.user
    let updatedUser=await UserModel.findById(user.id)
    if(!updatedUser.isUserActive){
        return res.status(200).json({message:"User is already inactive"})
    }
    updatedUser.isUserActive=false
    await updatedUser.save()
    res.status(200).json({message:"User deactivated",payload:updatedUser})
})
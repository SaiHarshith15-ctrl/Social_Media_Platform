import exp from 'express'
import {userModel} from '../model/userModel'
i


export const SocialApp = exp.Router()

SocialApp.post('/login',async(req,res)=>{
    const newuser = req.body
    const hashed = await hash(newuser.passowrd,10)
    newuser.password = hashed
    const newuserdocument = new userModel(newuser)
    newuser.password = hashed
    await newuserdocument.save()
    res.status(201).json({message:"user created"})
})
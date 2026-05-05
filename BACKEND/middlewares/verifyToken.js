import jwt from 'jsonwebtoken'
const {verify} =jwt

export const verifyToken=()=>{
    return (req,res,next)=>{
        try{
            // token verification logic
            const token=req.cookies?.token
            // if req from unauthoried user
            if(!token){
                return res.status(401).json({message:"Please Login"})
            }
            const decodedToken =verify(token,"hufhigjfigjiof")
            //  if(){
            //     return res.status(403).json({message:"Your are not authorized"})
            //  }
            console.log(decodedToken)
            req.user=decodedToken
            next()
        }catch(err){
            return res.status(401).json({message:"session expired"})
        }
}
} 
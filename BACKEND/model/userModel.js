import {Schema,Types,model} from 'mongoose';


const UserSchema=new Schema({
    firstname:{
        type:String,
        required:[true,"first name required"]
    },
    lastname:{
        type:String,
        required:[true,"last name required"]
    },
    // mobile:{
    //     type:Number,
    //     required:[true,"mobile number required"]

    // },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exists"]
    },
    username:{
        type:String,
        required:[true,"username required"],
        unique:[true,"username already exists"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    bio:{
        type:String,
    
    },
    profileImageUrl:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:true
    },

    followers: [{
        type: Types.ObjectId,
        ref: "User"
    }],

    following: [{
        type: Types.ObjectId,
        ref: "User"
    }]
},{
    timestamps:true,
    versionkey:false,
    
})

export const UserModel=model("User",UserSchema)
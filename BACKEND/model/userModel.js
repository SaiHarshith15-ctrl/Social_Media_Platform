import { Schema, Types, model } from 'mongoose';


const UserSchema = new Schema({
    firstname: {
        type: String,
        required: [true, "first name required"]
    },
    lastname: {
        type: String,
        required: [true, "last name required"]
    },
    // mobile:{
    //     type:Number,
    //     required:[true,"mobile number required"]

    // },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "email already exists"]
    },
    username: {
        type: String,
        required: [true, "username required"],
        unique: [true, "username already exists"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    bio: {
        type: String,

    },
    profileImageUrl: {
        type: String
    },
    isUserActive: {
        type: Boolean,
        default: true
    },

    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    followRequests: [
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ],
    interests: [{
     type: String,
     enum: ['Music', 'Tech', 'Sports', 'Art', 'Gaming', 'Food', 'Travel', 'Fashion', 'Finance', 'Health']
     }],
    notifications: [{
        type: {
            type: String,
            enum: ["like", "comment", "follow", "followRequest"]
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        postId: {
            type: Schema.Types.ObjectId,
            ref: "post"
        },

        message: String,

        isRead: {
            type: Boolean,
            default: false
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
    ]
}, {
    timestamps: true,
    versionKey: false

})

export const UserModel = model("User", UserSchema)
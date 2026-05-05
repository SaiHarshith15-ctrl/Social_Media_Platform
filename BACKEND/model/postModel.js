import { Schema, Types, model } from "mongoose";


const commentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "user id required"]
    },
    comment: {
        type: String,
        required: [true, "enter a comment"]
    }
}, { timestamps: true });

const postSchema = new Schema({

    user: {
        type: Types.ObjectId,
        ref: "user",
        required: true
    },

    content: {
        type: String,
        required: [true, "content is required"]
    },

    postImageUrl: String,

    
    likes: {
        type: [Types.ObjectId],
        ref: "user",
        default: []
    },

    likesCount: {
        type: Number,
        default: 0
    },


    comments: {
        type: [commentSchema],
        default: []
    },

    commentsCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true,
    versionKey: false,
    strict: "throw"
});

export const PostModel = model("post", postSchema);
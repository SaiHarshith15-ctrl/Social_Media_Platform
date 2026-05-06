import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { PostModel } from "../model/postModel.js";
import { UserModel } from "../model/userModel.js";
import { upload } from "../middlewares/multer.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const postApp = exp.Router();

// create user
postApp.post("/post", verifyToken(), async (req, res) => {
  try {
    const { content, postImageUrl } = req.body;
    // console.log(req.body)

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
     // make imageurl as null
    let imageUrl = null;
    // here req.file comes from multer like it checks if user uploaded image then the image uploads the req.file.buffer converts into binary and stored
    if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;//db stores( url - http , secure_url-https )
      }

    const newPost = new PostModel({
      user: req.user.id,
      content,
      postImageUrl,
    });

    await newPost.save();

    // increment user post count
    await UserModel.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: 1 },
    });

    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


postApp.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await PostModel.find()
      .populate("user", "username profileImageUrl")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// get post
postApp.get("/:postId", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate("user", "username profileImageUrl")
      .populate("comments.user", "username profileImageUrl");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// delete post
postApp.delete("/:postId", verifyToken(), async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check ownership
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    // decrement user post count
    await UserModel.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: -1 },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



postApp.get("/user/:userId", async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.params.userId })
      .populate("user", "username profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
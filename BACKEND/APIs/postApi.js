import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { PostModel } from "../model/postModel.js";
import { UserModel } from "../model/userModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const postApp = exp.Router();

// ── Create post (with optional image upload via multer) ───────────────────────
// IMPORTANT: upload.single("image") must be here so multer processes req.file
postApp.post("/post", verifyToken(), upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newPost = new PostModel({
      user: req.user.id,
      content,
      postImageUrl: imageUrl,
      category: req.body.category || ''
    })

    await newPost.save();

    await UserModel.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: 1 },
    });

    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── Get all posts (public feed, paginated) ────────────────────────────────────
postApp.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const posts = await PostModel.find()
      .populate("user", "username profileImageUrl")
      .populate("comments.user", "username profileImageUrl")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── Get single post ───────────────────────────────────────────────────────────
postApp.get("/:postId", verifyToken(), async (req, res) => {
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


// ── Delete post ───────────────────────────────────────────────────────────────
postApp.delete("/:postId", verifyToken(), async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await post.deleteOne();

    await UserModel.findByIdAndUpdate(req.user.id, {
      $inc: { postCount: -1 },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── Get all posts by a specific user ─────────────────────────────────────────
postApp.get("/user/:userId", verifyToken(), async (req, res) => {
  try {
    const posts = await PostModel.find({ user: req.params.userId })
      .populate("user", "username profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ payload: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── Add comment to post ───────────────────────────────────────────────────────
postApp.post("/:postId", verifyToken(), async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: req.user.id, comment });
    post.commentsCount = post.comments.length;
    await post.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// ── Delete comment ────────────────────────────────────────────────────────────
postApp.delete("/:postId/comment/:commentId", verifyToken(), async (req, res) => {
  const { postId, commentId } = req.params;

  const post = await PostModel.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = post.comments.id(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (comment.user.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  comment.deleteOne();
  post.commentsCount = post.comments.length;
  await post.save();

  res.status(200).json({ message: "Comment deleted successfully" });
});


// Get posts filtered by interests array
postApp.get('/by-interests', async (req, res) => {
  try {
    const { interests, page = 1, limit = 10 } = req.query
    const interestArr = interests ? interests.split(',') : []
    
    const query = interestArr.length > 0 ? { category: { $in: interestArr } } : {}
    
    const posts = await PostModel.find(query)
      .populate('user', 'username profileImageUrl')
      .populate('comments.user', 'username profileImageUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.status(200).json({ posts })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
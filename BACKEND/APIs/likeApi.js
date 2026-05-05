import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { PostModel } from '../model/postModel.js'

export const likeApp = exp.Router()

// Like or Unlike (toggle)
likeApp.put('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId)

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        const userId = req.user.id
        const alreadyLiked = post.likes.some(id => id.toString() === userId)

        if (alreadyLiked) {
            // Unlike
            post.likes = post.likes.filter(id => id.toString() !== userId)
            post.likesCount = post.likes.length
            await post.save()
            return res.status(200).json({ message: "Post unliked", likesCount: post.likesCount })
        } else {
            // Like
            post.likes.push(userId)
            post.likesCount = post.likes.length
            await post.save()
            return res.status(200).json({ message: "Post liked", likesCount: post.likesCount })
        }

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Get likes on a post
likeApp.get('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId)
            .populate('likes', 'username profileImageUrl')

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        res.status(200).json({ likes: post.likes, likesCount: post.likesCount })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { UserModel } from '../model/userModel.js'
import { upload } from '../config/multer.js'
import { uploadToCloudinary } from '../config/cloudinaryUpload.js'
import { hash } from 'bcryptjs'

export const userApp = exp.Router()

// GET user by ID
// GET user by ID — skip if it looks like a follow/unfollow/search route
userApp.get('/:userId', verifyToken(), async (req, res, next) => {
  const skip = ['edit-profile', 'search']
  if (skip.includes(req.params.userId)) return next()
  try {
    const user = await UserModel.findById(req.params.userId).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json({ payload: user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT edit profile
userApp.put('/edit-profile', verifyToken(), upload.single('image'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (req.body.bio) user.bio = req.body.bio
    if (req.body.password) user.password = await hash(req.body.password, 12)
    if (req.body.interests) user.interests = JSON.parse(req.body.interests)

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer)
      user.profileImageUrl = result.secure_url
    }

    await user.save()
    const updated = user.toObject()
    delete updated.password
    res.status(200).json({ message: 'Profile updated', payload: updated })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Search users by username
userApp.get('/search/:query', verifyToken(), async (req, res) => {
  try {
    const users = await UserModel.find({
      username: { $regex: req.params.query, $options: 'i' } //used to search i means case sensitive like even if H or h etc
    }).select('username firstname lastname profileImageUrl bio followers following')
    res.status(200).json({ payload: users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})
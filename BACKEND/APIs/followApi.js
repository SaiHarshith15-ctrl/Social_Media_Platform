import exp from 'express'
import mongoose from 'mongoose'
import { verifyToken } from '../middlewares/verifyToken.js'
import { UserModel } from '../model/userModel.js'

export const followApp = exp.Router()

// FOLLOW USER
followApp.put('/:id/follow', verifyToken(), async (req, res) => {
  try {

    // User to follow
    const targetUserId = req.params.id

    // Logged-in user
    const currentUserId = req.user.id

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({
        message: "Invalid user ID"
      })
    }

    // Prevent self-follow
    if (targetUserId === currentUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      })
    }

    // Find users
    const targetUser = await UserModel.findById(targetUserId)
    const currentUser = await UserModel.findById(currentUserId)

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    // Already following check
    const alreadyFollowing =
      currentUser.following.includes(targetUserId)

    if (alreadyFollowing) {
      return res.status(400).json({
        message: "Already following this user"
      })
    }

    // PRIVATE ACCOUNT
    if (targetUser.isPrivate) {

      // Already requested
      const alreadyRequested =
        targetUser.followRequests.includes(currentUserId)

      if (alreadyRequested) {
        return res.status(400).json({
          message: "Follow request already sent"
        })
      }

      // Add follow request
      targetUser.followRequests.push(currentUserId)

      // Notification
      targetUser.notifications.unshift({
        type: "followRequest",
        sender: currentUserId,
        message: `${currentUser.username} sent you a follow request`
      })

      await targetUser.save()

      return res.status(200).json({
        message: "Follow request sent"
      })
    }

    // PUBLIC ACCOUNT FOLLOW

    // Add to following
    currentUser.following.push(targetUserId)

    // Add follower
    targetUser.followers.push(currentUserId)

    // Notification
    targetUser.notifications.unshift({
      type: "follow",
      sender: currentUserId,
      message: `${currentUser.username} started following you`
    })

    await currentUser.save()
    await targetUser.save()

    res.status(200).json({
      message: "User followed successfully"
    })

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})


// UNFOLLOW USER
followApp.put('/:id/unfollow', verifyToken(), async (req, res) => {
    try{
        // User to follow
        const targetUserId = req.params.id

        // Logged-in user
        const currentUserId = req.user.id

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        return res.status(400).json({
            message: "Invalid user ID"
        })
        }
        // Find users
        const targetUser = await UserModel.findById(targetUserId)
        const currentUser = await UserModel.findById(currentUserId)

        if (!targetUser || !currentUser) {
        return res.status(404).json({
            message: "User not found"
        })
        }
        const isFollowing=currentUser.following.includes(targetUser._id)
        if(!isFollowing){
            return res.status(400).json({
                message:"You are not following this user"
            })
        }
        // Remove from following
        currentUser.following =
        currentUser.following.filter(
            id => id.toString() !== targetUserId
        )

        // Remove from followers
        targetUser.followers =
        targetUser.followers.filter(
            id => id.toString() !== currentUserId
        )
        
        targetUser.notifications =
            targetUser.notifications.filter(
                notification =>!(notification.type === "follow" && notification.sender.toString() === currentUserId)
            )
            
    await currentUser.save()
    await targetUser.save()

    res.status(200).json({
      message: "User unfollowed successfully"
    })

    }catch (err) {
    res.status(500).json({
      message: err.message
    })
  }

})

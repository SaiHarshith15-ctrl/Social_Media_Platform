import exp from 'express'
import { UserModel } from '../model/userModel.js'

import { verifyToken } from '../middlewares/verifyToken.js'

export const notificationApp = exp.Router()

// Get notifications
notificationApp.get('/',verifyToken(),async(req,res)=>{
  try {
    const user = await UserModel.findById(req.user.id)
      .populate(
        'notifications.sender',
        'username profileImageUrl'
      )
      .populate(
        'notifications.postId',
        'image text'
      )

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    res.status(200).json({
      notifications: user.notifications
    })

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }

})

// Mark notification as read
notificationApp.put('/:notificationId/read',verifyToken(),async(req,res)=>{
  try {

    const user = await UserModel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const notification =
      user.notifications.id(req.params.notificationId)

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      })
    }

    notification.isRead = true

    await user.save()

    res.status(200).json({message: "Notification marked as read"})

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }

})

// Clear all notifications
notificationApp.delete('/',verifyToken(),async(req,res)=>{
  try {

    const user = await UserModel.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    user.notifications = []

    await user.save()

    res.status(200).json({
      message: "All notifications cleared"
    })

  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }

})
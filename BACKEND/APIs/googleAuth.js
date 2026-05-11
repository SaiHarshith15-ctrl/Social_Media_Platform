import express from "express"
import { OAuth2Client } from "google-auth-library"
import jwt from "jsonwebtoken"
import { UserModel } from "../model/userModel.js"

const router = express.Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body

    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const { name, email, picture, given_name, family_name } = ticket.getPayload()

    // 2. Find existing user OR create a new one
    let user = await UserModel.findOne({ email })

    if (!user) {
      // Generate a unique username from email prefix
      const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "")
      let username = baseUsername
      let count = 1

      // Make sure username is unique
      while (await UserModel.findOne({ username })) {
        username = `${baseUsername}${count++}`
      }

      user = await UserModel.create({
        firstname:  given_name  || name.split(" ")[0] || "User",
        lastname:   family_name || name.split(" ")[1] || "",
        email,
        username,
        password:         "google-oauth-" + Math.random().toString(36),  // placeholder, never used
        profileImageUrl:  picture || "",
        bio:              "",
      })
    }

    // 3. Sign a JWT the same way your normal login does
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 4. Set the cookie the same way your normal login does
    //    (adjust cookie name/options to match your verifyToken middleware)
    res.cookie("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   7 * 24 * 60 * 60 * 1000,   // 7 days in ms
    })

    // 5. Return the user payload so the frontend store can set currentUser
    res.json({
      success: true,
      payload: {
        _id:             user._id,
        firstname:       user.firstname,
        lastname:        user.lastname,
        username:        user.username,
        email:           user.email,
        profileImageUrl: user.profileImageUrl,
        bio:             user.bio,
        followers:       user.followers,
        following:       user.following,
      },
    })

  } catch (error) {
    console.error("Google auth error:", error)
    res.status(500).json({ success: false, message: "Google login failed" })
  }
})

export default router
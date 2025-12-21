import User from "../models/User.js"
import mailSender from "../utils/mailSender.js"
import crypto from "crypto"

// ================= RESET PASSWORD TOKEN =================
export const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      })
    }

    const token = crypto.randomBytes(20).toString("hex")

    await User.findOneAndUpdate(
      { email },
      {
        token,
        resetPasswordExpires: Date.now() + 3600000, // 1 hour
      },
      { new: true }
    )

    const url = `${process.env.FRONTEND_URL}/update-password/${token}`

    await mailSender(
      email,
      "Password Reset",
      `Click the link to reset your password: ${url}`
    )

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error sending reset password email",
      error: error.message,
    })
  }
}

import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";
import emailTemplate from "../mail/templates/emailVerficationTemplate.js";

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    otp: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5, // Auto delete after 5 minutes
    },
  }
);

// -------------------------------
//  Send Verification Email
// -------------------------------

async function sendVerificationEmail(email, otp) {
  try {
    // create transporter to send emails

    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );

    console.log("Email Sent Successfully:", mailResponse.response);
  } catch (error) {
    console.log("Email Sending Error:", error);
    throw error;
  }
}

// -------------------------------------
//  PRE-SAVE HOOK → Auto Send Email and after the document has been saved
// -------------------------------------

OtpSchema.pre("save", async function (next) {
  console.log("new document saved to database");

  // only send a email when new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;

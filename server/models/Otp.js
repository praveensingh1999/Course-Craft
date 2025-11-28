import mongoose from "mongoose";

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
      expires: 60*5, // document will automatically deleted otp after 5 minute from creation time

     
      
      
    },


    
});

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;

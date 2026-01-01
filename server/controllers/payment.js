// logic
// 1️⃣ Frontend selects multiple courses
// 2️⃣ Backend creates Razorpay Order
// 3️⃣ Frontend completes payment via Razorpay
// 4️⃣ Razorpay sends payment details + signature
// 5️⃣ Backend verifies signature
// 6️⃣ Student is enrolled in courses
// 7️⃣ Emails are sent

import { instance } from "../config/razorpay.js";
import Course from "../models/Course.js";
import crypto from "crypto";
import User from "../models/User.js";
import {mailSender} from "../utils/mailSender.js";
import mongoose from "mongoose";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSucessEmail.js";
import CourseProgress from "../models/CourseProgress.js";

// CREATE ORDER
export const capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!courses || courses.length === 0) {
    return res.json({ success: false, message: "No courses provided" });
  }

  let totalAmount = 0;

  for (const courseId of courses) {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnroled.includes(uid)) {
      return res.json({ success: false, message: "Already enrolled" });
    }

    totalAmount += course.price;
  }

  const order = await instance.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: Date.now().toString(),
  });

  res.json({ success: true, order });
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;

  const userId = req.user.id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.json({ success: false, message: "Payment verification failed" });
  }

  await enrollStudents(courses, userId);
  res.json({ success: true, message: "Payment verified & enrolled" });
};

// SEND PAYMENT EMAIL
export const sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const user = await User.findById(req.user.id);

  await mailSender(
    user.email,
    "Payment Received",
    paymentSuccessEmail(
      `${user.firstName} ${user.lastName}`,
      amount / 100,
      orderId,
      paymentId
    )
  );

  res.json({ success: true });
};

// ENROLL LOGIC
const enrollStudents = async (courses, userId) => {
  for (const courseId of courses) {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { $push: { studentsEnroled: userId } },
      { new: true }
    );

    const progress = await CourseProgress.create({
      courseID: courseId,
      userId,
      completedVideos: [],
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: courseId,
          courseProgress: progress._id,
        },
      },
      { new: true }
    );

    await mailSender(
      user.email,
      `Enrolled in ${course.courseName}`,
      courseEnrollmentEmail(
        course.courseName,
        `${user.firstName} ${user.lastName}`
      )
    );
  }
};

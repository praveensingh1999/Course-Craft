import Course from "../models/Course.js"
import Category from "../models/Category.js"
import Section from "../models/Section.js"
import SubSection from "../models/SubSection.js"
import User from "../models/User.js"
import CourseProgress from "../models/CourseProgress.js"

import { uploadImageToCloudinary } from "../utils/imageUploader.js"
import { convertSecondsToDuration } from "../utils/secToDuration.js"

// ================= CREATE COURSE =================
export const createCourse = async (req, res) => {
  try {
    const userId = req.user.id
// fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body


    // get thumbnail
    const thumbnail = req.files.thumbnailImage

    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    // validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }

    if (!status) status = "Draft"
// check for instructor 
    const instructorDetails = await User.findById(userId)

    // validate
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }
// check the giventag is valid or not
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
// upload on cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
// create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,
    })
// add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    )
 // update category schema
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    )

    // return response
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

// ================= EDIT COURSE =================
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    if (req.files) {
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    for (const key in updates) {
      if (key === "tag" || key === "instructions") {
        course[key] = JSON.parse(updates[key])
      } else {
        course[key] = updates[key]
      }
    }

    await course.save()

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// ================= GET ALL COURSES =================
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "Published" })
      .populate("instructor")

    res.status(200).json({
      success: true,
      data: courses,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Can't Fetch Course Data",
    })
  }
}

// ================= GET COURSE DETAILS =================
export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      })
    }

    let totalSeconds = 0
    courseDetails.courseContent.forEach(section =>
      section.subSection.forEach(sub =>
        totalSeconds += parseInt(sub.timeDuration)
      )
    )

    const totalDuration = convertSecondsToDuration(totalSeconds)

    res.status(200).json({
      success: true,
      data: { courseDetails, totalDuration },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ================= DELETE COURSE =================
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    for (const studentId of course.studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId)
      if (section) {
        for (const subId of section.subSection) {
          await SubSection.findByIdAndDelete(subId)
        }
      }
      await Section.findByIdAndDelete(sectionId)
    }

    await Course.findByIdAndDelete(courseId)

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
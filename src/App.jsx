import { Route, Routes } from "react-router-dom";
import Contact from "./pages/Contact";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import About from "./pages/About";
import "./App.css";
import BacktoTop from "./components/common/BacktoTop";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings/Settings";

import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/Cart";
// import AddCourse from "./components/core/Dashboard/AddCourse";
// import MyCourses from "./components/core/Dashboard/MyCourses";
// import EditCourse from "./components/core/Dashboard/EditCourse";
import CourseDetails from "./pages/CourseDetails";
// import ViewCourse from "./pages/ViewCourse";
// import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import { ACCOUNT_TYPE } from "./utils/constant";
import { useSelector } from "react-redux";

function App() {
  //  const dispatch = useDispatch();
  // const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.profile)

  return (
    <div className="w-screen min-h-screen bg-[#0C2B4E] flex flex-col font-inter">
      <Navbar />

      {/* ✅ ALL ROUTES MUST BE INSIDE <Routes> */}
      <Routes>
        {/* Open routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
        <Route
          path="/about"
          element={
            
              <About />
            
          }
        />
        <Route path="courses/:courseId" element={<CourseDetails/>} />
    

        <Route path="/contact" element={<Contact />} />


        <Route
          path="/verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />

        <Route
          path="/update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />

        {/* Protected route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
         
         <Route path="my-profile" element={<MyProfile />} />
      
      <Route path="Settings" element={<Settings />} />
           {
        user?.role === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="cart" element={<Cart />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }

       {
        user?.role === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          <Route path="instructor" element={<Instructor />} />
          {/* <Route path="add-course" element={<AddCourse />} /> */}
          {/* <Route path="my-courses" element={<MyCourses />} /> */}
          {/* <Route path="edit-course/:courseId" element={<EditCourse />} /> */}
          
          </>
        )
      }

       </Route>

        {/* <Route element={
        <PrivateRoute>
          <ViewCourse />
        </PrivateRoute>
      }>

      {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route 
            path="courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
          />
          </>
        )
      }

      </Route> */}

        {/* 404 */}
        <Route path="*" element={<Error />} />
      </Routes>

       <BacktoTop/>
    </div>
  );
}

export default App;

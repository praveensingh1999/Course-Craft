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

function App() {
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
        />

        {/* 404 */}
        <Route path="*" element={<Error />} />
      </Routes>

       <BacktoTop/>
    </div>
  );
}

export default App;

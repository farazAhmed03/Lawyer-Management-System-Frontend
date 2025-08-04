import React from "react";
import Main from "./Main";
import { ToastContainer } from 'react-toastify';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateAccount from "./Components/CreateAccount-to-user/CreateAccount";
import Verification from "./Components/Verification/Verification";
import Login from "./Components/Login/Login";
import About from "./Components/Aboutus/About";
import Blog from "./Components/Blog/Blog";
import Layout from "./Components/layout/dashboard/Layout";
import Dashboard from "./Components/layout/dashboard/Dashboard";
import MyAppointments from "./Components/layout/dashboard/MyAppointments";
import Mycase from "./Components/layout/Mycase/Mycase";
import Home from "./Components/LandingPage/Home";
import Lawyercreate from "./Components/Lawyer/Lawyercreateaccount/Lawyercreate";
import Lawyerlogin from "./Components/Lawyer/LawyerLogin/Lawyerlogin";
import Appointment from "./Components/Appointment/Appointment";
import Applycase from "./Components/Applytocase/Applycase";

// Lawyer routes
import LawyerAppointments from "./Components/Appointment/LawyerAppointment";
import Lawyerdashboard from "./Components/Lawyerdashboard/Lawyerdashboard";
import LawyerLayout from "./Components/layout/Lawyerlayout/Lawyerlayout";
import Myprofile from "./Components/layout/MyProfile/Myprofile";
import Lawyerforgotpasswords from "./Components/Lawyer/Lawyerfotgot/Lawyerforgotpassword";
import Seelawyer from "./Components/layout/Lawyerlayout/Lawyercatergories/Seelawyer";
import LawyerProfile from "./Components/Lawyer/Lawyerprofile";
import ForgotPassword from "./Components/LandingPage/Forgotpassword/Forgotpassword";
import Lawyerpayment from "./Components/LawyerPayment/Lawyerpayment";
import LawyerCaseRecord from "./Components/Lawyer/Lawyercaserecord/Lawyercase";
import LawyerCaseDetails from "./Components/Lawyer/Lawyercaserecord/SingleCase";
import Lawyerprofilemy from "./Components/Lawyer/Lawyerprofilemy/Lawyerprofile";
import SendOTP from "./Components/Verification/SendOtp";
import ResetPassword from "./Components/resetpassword/Reset";

// Socket 
import socket from '../src/SocketService/Socket';

// Chatting Routes 
import ChatPage from "./Components/Pages/ChatPage";

// Review Route 
import ReviewForm from './Components/RatingAndReview/ReviewForm'
import MyReviews  from './Components/RatingAndReview/MyReview'


export default function App() {
  return (
    <Router>
      {/* Toast Notification */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />


      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/sendotp" element={<SendOTP />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/blog" element={<Blog />} />

        {/* Client routes Appointments and Applycase submission */}
        <Route path="/appointment/:lawyerId" element={<Appointment />} />
        <Route path="/applycase/:appointmentId" element={<Applycase />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Client Dashboard */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="myappointments" element={<MyAppointments />} />
          <Route path="mycase" element={<Mycase />} />
          <Route path="myprofile" element={<Myprofile />} />
          <Route path="seelawyer" element={<Seelawyer />} />
        </Route>



        {/* lawyer routes */}
        <Route path="/lawyercreateanaccount" element={<Lawyercreate />} />
        <Route path="/lawyerlogin" element={<Lawyerlogin />} />
        <Route path="/lawyerdashboard" element={<Lawyerdashboard />} />
        <Route path="/lawyerforgotpasswords" element={<Lawyerforgotpasswords />} />
        <Route path="/lawyerprofile/:id" element={<LawyerProfile />} />


        {/* Lawyer Dashboard */}
        <Route path="/lawyerdashboard" element={<LawyerLayout />}>
          <Route index element={<Lawyerdashboard />} />
          <Route path="myappointments" element={<LawyerAppointments />} />
          <Route path="case-details/:id" element={<LawyerCaseDetails />} />
          <Route path="lawyerpayment" element={<Lawyerpayment />} />
          <Route path="lawyercase" element={<LawyerCaseRecord />} />
          <Route path="lawyerprofilem" element={<Lawyerprofilemy />} />
        </Route>


        {/* Chatting Route */}
        <Route path="/chat/:id" element={<ChatPage socket={socket} />} />
        <Route path="/chat" element={<ChatPage socket={socket} />} />


        {/* Review Route */}
        <Route path="/review/:lawyerId/:caseId" element={<ReviewForm />} />
        <Route path="/lawyer-reviews/:lawyerId" element={<MyReviews />} />



      </Routes>
    </Router>
  );
}

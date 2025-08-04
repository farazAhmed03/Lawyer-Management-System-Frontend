import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './SendOtp.css';

export default function SendOTP() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    try {
      const response = await axios.post('http://localhost:3000/api/v1/auth/send-otp', { email });

      if (response.data.success) {
        toast.success('OTP sent to your email');
        localStorage.setItem('verify_email', email);
        setTimeout(() => navigate('/Verification'), 1500);
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error sending OTP');
    }
  };

  return (
    <div id="sendotp-main">
      <ToastContainer />
      <div id="sendotp-box">
        <h2>Verify Your Email</h2>
        <form onSubmit={handleSendOtp}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

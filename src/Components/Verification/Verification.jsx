import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import './Verification.css';

export default function Verification() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const inputsRef = useRef([]);

  // Retrieve email and role from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('verify_email');
    const storedRole = localStorage.getItem('verify_role');

    if (!storedEmail || !storedRole) {
      toast.error('Missing data, please login again');
      navigate('/login');
    } else {
      setEmail(storedEmail);
      setRole(storedRole);
    }
  }, [navigate]);

  // Cooldown timer effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9a-zA-Z]{0,1}$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (/^[0-9a-zA-Z]{6}$/.test(paste)) {
      const chars = paste.split('');
      setCode(chars);
      chars.forEach((char, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = char;
        }
      });
    } else {
      toast.error('Invalid OTP format');
    }
  };

  const handleVerify = async () => {
    const otp = code.join('');
    if (otp.length !== 6) return toast.error('Please enter complete OTP');

    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/verify-otp', { email, otp });
      if (res.data.success) {
        toast.success('Verification successful! Redirecting...', {
          autoClose: 3000,
          onClose: () => {
            localStorage.removeItem('verify_email');
            localStorage.removeItem('verify_role');
            if (role === 'client') navigate('/');
            else if (role === 'lawyer') navigate('/lawyerdashboard');
            else navigate('/');
          }
        });
      } else {
        toast.error(res.data.message || 'Verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error verifying OTP');
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await axios.post('http://localhost:3000/api/v1/auth/send-otp', { email });
      if (res.data.success) {
        toast.success('OTP resent to your email');
        setResendTimer(60); // Start 1 minute cooldown
      } else {
        toast.error(res.data.message || 'Could not resend OTP');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="verification-page">
      <ToastContainer position="top-center" />
      <motion.div
        className="verification-box"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3>Enter OTP Code</h3>
        <p className="otp-instruction">Please check your email and enter the 6-digit code</p>

        <div className="otp-inputs">
          {code.map((char, idx) => (
            <input
              key={idx}
              maxLength={1}
              value={char}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
              ref={(el) => (inputsRef.current[idx] = el)}
            />
          ))}
        </div>

        <div className="buttons">
          <button className="verify-btn" onClick={handleVerify}>Verify</button>
          <p
            className={`resend-link ${resendTimer > 0 ? 'disabled' : ''}`}
            onClick={handleResend}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import './Lawyercrete.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import signuptolawyer from '../../../Asserts/Img/law.svg';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Lawyercreate() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [barCode, setBarCode] = useState('');
  const [specialization, setSpecialization] = useState('');

  const goToLoginPage = () => {
    navigate('/lawyerlogin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword || !barCode || !specialization) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 3) {
      toast.error('Password must be at least 3 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // if (!/^\d{7}$/.test(barCode)) {
    //   toast.error('Bar Code must be exactly 7 digits.');
    //   return;
    // }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/register',
        {
          username,
          email,
          password,
          role: 'lawyer',
          barNumber: barCode,
          specialization,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/lawyerlogin');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Container fluid>
        <Row>
          <Col lg={5} md={12} id="maindiv-createaccount-to-sana">
            <img className="img-fluid" src={signuptolawyer} alt="" />
          </Col>

          <Col lg={7} md={12}>
            <div className="leftsidemain-createaccount-to-sana">
              <div className="icon-and-button-parentdiv">
                <Icon id="worldicon1" icon="tabler:world" />
                <button onClick={goToLoginPage} id="btncreateaccount">
                  Sign In
                </button>
              </div>

              <div className="createaccounth4andpdiv">
                <h4>Create a Lawyer Account</h4>
                <p>
                  Discover a world of natural remedies with our expert <br /> herbalists
                </p>

                <form onSubmit={handleSubmit}>

                  <div className="smallandinputmaindiv1">
                    <small>Your Name</small>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="smallandinputmaindiv1">
                    <small>Your email</small>
                    <input
                      type="email"
                      placeholder="Enter email here"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="smallandinputmaindiv1">
                    <small>Your Password</small>
                    <input
                      type="password"
                      placeholder="Enter Password here"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="smallandinputmaindiv1">
                    <small>Confirm password</small>
                    <input
                      type="password"
                      placeholder="Confirm password here"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="smallandinputmaindiv1">
                    <small>Bar Code</small>
                    <input
                      type="text"
                      placeholder="Enter your 7-digit Bar Code"
                      value={barCode}
                      onChange={(e) => setBarCode(e.target.value)}
                    />
                  </div>

                  <div className="smallandinputmaindiv1">
                    <small>Specialization</small>
                    <input
                      type="text"
                      placeholder="Enter your Specialization"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                    />
                  </div>

                  <button id="signbtn" type="submit">Sign Up</button>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}


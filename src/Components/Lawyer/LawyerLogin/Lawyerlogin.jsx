import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import handleError from '../../../Utils/errorHandler';
import BASE_URL from '../../../Config/Api';
import signuptolawyer from '../../../Asserts/Img/law.svg';

import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const goToLoginPage = () => {
    navigate('/createaccount');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      // console.log(response.data);
      if (response.data.data.role !== 'lawyer') {
        return toast.error("You are not a Lawyer! Please Login as a Lawyer");
      }

      if (response.data.success) {
        toast.success('Login successful');
        localStorage.setItem("UserId" , response.data.data._id);

        setTimeout(() => {
          if (response.data.data.isVerified === false || response.data.data.isVerified === 'false') {
            localStorage.setItem('verify_email', email);
            localStorage.setItem('verify_role', response.data.role);
            navigate('/sendotp');
          } else {
            navigate('/lawyerdashboard');
          }
        }, 1500);
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
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
                  Sign Up
                </button>
              </div>

              <div className="createaccounth4andpdiv">
                <h4>Login</h4>
                <p>
                  Discover a world of natural remedies with our expert <br /> herbalists
                </p>

                <form onSubmit={handleSubmit}>
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

                  {/*  Forgot Password Link */}
                  <div style={{ textAlign: 'right', marginBottom: '1rem', fontSize: '1.5rem' }}>
                    <span
                      onClick={handleForgotPassword}
                      style={{
                        color: '#2c3e50',
                        cursor: 'pointer',
                        fontWeight: '500',
                        textDecoration: 'underline',
                      }}
                    >
                      Forgot Password?
                    </span>
                  </div>

                  <button id="signbtn" type="submit">
                    Sign In
                  </button>
                </form>

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

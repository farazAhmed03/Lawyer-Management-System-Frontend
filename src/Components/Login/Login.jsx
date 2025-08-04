import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import signuptolawyer from '../../Asserts/Img/law.svg';
import google from '../../Asserts/Img/google.svg';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import BASE_URL from "../../Config/Api";
import handleError from "../../../src/Utils/errorHandler";
import { auth, provider, signInWithPopup } from '../../FirebaseConfig/Firebase';


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToLoginPage = () => {
    navigate('/createaccount');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.data.role !== 'client') {
        return toast.error("You are not a client! Please Login as a Client");
      }

      if (response.data.success) {
        toast.success('Login successful');
        localStorage.setItem("userId" , response.data.data._id);

        setTimeout(() => {
          if (!response.data.data.isVerified) {
            localStorage.setItem('verify_email', email);
            localStorage.setItem('verify_role', response.data.role);
            navigate('/sendotp');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }

    } catch (error) {
      handleError(error, 'Failed to login');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgotpassword');
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Result =>", result); 
      const idToken = await result.user.getIdToken();

      const res = await axios.post(
        `${BASE_URL}/auth/google-login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Login successful with Google");
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("UserId", res.data.data._id);
        navigate("/dashboard");
      }

    } catch (err) {
      toast.error("Google login failed");
      console.error(err);
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

                <div className="signupline">
                  <span>--- Or Sign in With ---</span>
                </div>

                <div
                  id="googlebtndiv"
                  className="facebookbtndiv"
                  onClick={handleGoogleLogin}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={google} alt="" />
                  <span>Sign in With Google</span>
                </div>

              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

import React, { useState } from 'react';
import './CreateAccount.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import signuptolawyer from '../../Asserts/Img/law.svg';
import facebook from '../../Asserts/Img/facebook.svg';
import google from '../../Asserts/Img/google.svg';
import BASE_URL from "../../Config/Api";
import handleError from "../../../src/Utils/errorHandler";

import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function CreateAccount() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const goToLoginPage = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/auth/register`,
        {
          username,
          email,
          password,
          role: 'client',
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Account created successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      handleError(error, 'Failed to create account');
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
                <h4>Create an Account</h4>
                <p>
                  Discover a world of natural remedies with our expert <br /> herbalists
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="smallandinputmaindiv1">
                    <small>Your Name</small>
                    <input
                      type="text"
                      placeholder="Enter UserName here"
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

                  <button id="signbtn" type="submit">
                    Sign Up
                  </button>
                </form>

                <div className="signupline">
                  <span>--- Or Sign in With ---</span>
                </div>

                <div id="googlebtndiv" className="facebookbtndiv">
                  <img src={google} alt="" />
                  <span>Sign up With Google</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

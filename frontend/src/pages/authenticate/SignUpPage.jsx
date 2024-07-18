import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button } from "antd";
import { useNavigate, NavLink } from "react-router-dom";
import { signUpAsync } from "../../reducers/AuthReducer";

const SignUpPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(
    (state) => state.authReducer || { error: null, isAuthenticated: false }
  );

  const validateEmail = (_, email) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email || re.test(String(email).toLowerCase())) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid email format. Email must end with @gmail.com"));
  };

  const validatePassword = (_, password) => {
    if (!password || password.length >= 6) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Password must be at least 6 characters long"));
  };

  const submit = async (values) => {
    const { fullname, email, password } = values;
    await dispatch(signUpAsync(fullname, email, password));
    navigate("/signin-page"); // Navigate to SignInPage after successful sign-up
  };

  return (
    <SignUpStyle>
      <div className="container">
        <div className="header">
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <Form form={form} onFinish={submit} className="form">
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Full Name is required" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Email is required" }, { validator: validateEmail }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }, { validator: validatePassword }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <div className="signin-link">
          <span>Already have an account? </span>
          <NavLink to="/signin-page" className="signin-button">
            Sign In
          </NavLink>
        </div>
      </div>
    </SignUpStyle>
  );
};

const SignUpStyle = styled.div`
  * {
    color: var(--color-yellow);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  }

  .container {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 300px;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    width: 100%;
    margin-top: 30px;
  }

  .text {
    font-size: 48px;
    font-weight: 600;
    color: var(--color-yellow);
  }

  .underline {
    width: 100px;
    height: 5px;
    border-radius: 9px;
    background-color: var(--color-yellow);
  }

  .form {
    margin-top: 55px;
  }

  .submit-button {
    width: 100%;
    background-color: var(--color-yellow);
    border-color: var(--color-yellow);
    color: black; /* Button text color */
  }

  .submit-button:hover {
    background-color: #e0b800;
    border-color: #e0b800;
    color: black; /* Button text color */
  }

  .signin-link {
    margin-top: 20px;
    text-align: center;
    color: var(--color-yellow);

    .signin-button {
      color: var(--color-yellow);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;

      &:hover {
        color: #e0b800;
      }
    }
  }

  .error-message {
    color: red;
  }
`;

export default SignUpPage;

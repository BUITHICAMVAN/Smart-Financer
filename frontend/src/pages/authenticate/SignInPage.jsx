import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button } from "antd";
import { useNavigate, NavLink } from "react-router-dom";
import { signInAsync } from "../../reducers/AuthReducer";

const SignInPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(
    (state) => state.authReducer || { error: null, isAuthenticated: false }
  );

  const submit = async (values) => {
    const { email, password } = values;
    await dispatch(signInAsync({ email, password }));
    navigate("/dashboard-page"); // Navigate to DashboardPage after successful sign-in
  };

  return (
    <SignInStyle>
      <div className="container">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <Form form={form} onFinish={submit} className="form">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "The input is not valid E-mail!" }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          {/* <p className="forgot-password text-right mt-2">
            Forgot{" "}
            <a href="#" style={{ textDecoration: "none", color: "var(--color-yellow)" }}>
              {" "}
              password
            </a>
            ?
          </p> */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submit-button">
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="signup-link">
          <span>Don't have an account? </span>
          <NavLink to="/signup-page" className="signup-button">
            Sign Up
          </NavLink>
        </div>
      </div>
    </SignInStyle>
  );
};

const SignInStyle = styled.div`
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

  .forgot-password {
    color: var(--color-yellow);
  }

  .error-message {
    color: red;
  }

  .signup-link {
    margin-top: 20px;
    text-align: center;
    color: var(--color-yellow);

    .signup-button {
      color: var(--color-yellow);
      text-decoration: none;
      font-weight: bold;
      transition: color 0.3s;

      &:hover {
        color: #e0b800;
      }
    }
  }
`;

export default SignInPage;

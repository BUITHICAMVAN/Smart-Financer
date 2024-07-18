import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { signUpAsync } from "../../reducers/SignUpReducer"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated } = useSelector(
    (state) => state.signupReducer || { error: null, isAuthenticated: false }
  );

  const submit = async (e) => {
    e.preventDefault();
    dispatch(signUpAsync(fullname, email, password));
  };

  if (isAuthenticated) {
    navigate("/dashboard-page");
  }

  return (
    <SignUpStyle>
      <div className="container">
        <div className="header">
          <div className="text">Sign Up</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={submit}>
          <div className="input">
            <span className="label-value">Full Name</span>
            <div className="input-value">
              <input
                type="text"
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
                placeholder=""
              />
            </div>
          </div>
          <div className="input">
            <span className="label-value">Email</span>
            <div className="input-value">
              <input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder=""
              />
            </div>
          </div>
          <div className="input">
            <span className="label-value">Password</span>
            <div className="input-value">
              <input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder=""
              />
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="d-grid gap-2 mt-3">
            <input className="btn btn-primary" type="submit" value="Sign Up" />
          </div>
        </form>
      </div>
    </SignUpStyle>
  );
};

const SignUpStyle = styled.div`
  * {
    color: #ffffff;
    background-color: #070734;
  }

  .container {
    display: flex;
    flex-direction: column;
    margin: auto;
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
  }

  .underline {
    width: 100px;
    height: 5px;
    border-radius: 9px;
    background-color: #ffffff;
  }

  .inputs {
    margin-top: 55px;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 25px;
    width: 100%;
  }
  .input .label-value {
    font-size: 18px;
    font-weight: 500;
  }

  .input-value {
    display: flex;
    align-items: center;
    margin-top: 5px;
    width: 100%;
    height: 40px;
    border-radius: 6px;
    background-color: #ffffff;
    opacity: 0.3;
  }

  .input input {
    height: 40px;
    width: 300px;
    background: transparent;
    border: none;
    outline: none;
    color: #070734;
    font-size: 16px;
  }

  .input select {
    height: 40px;
    width: 300px;
    background: transparent;
    border: none;
    outline: none;
    color: #070734;
    font-size: 16px;
  }

  .d-grid .btn {
    margin-top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    background-color: #5454b8;
    border: #5454b8;
    font-size: 20px;
    font-weight: 600;
    cursor: pointer;
  }

  .d-grid .btn:focus {
    display: flex;
    background-color: #5454b8;
    border: #5454b8;
  }

  .error-message {
    color: red;
  }
`;

export default SignUpPage;

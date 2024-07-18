import React, { useState } from "react";
import styled from "styled-components";

const SignInPage = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const submit = async (e) => {};

  return (
    <SignInStyle>
      <div className="container">
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <form className="inputs" action="POST">
          <div className="input">
            <span className="label-value">Username</span>
            <div className="input-value">
              <input
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
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
          <p className="forgot-password text-right mt-2">
            Forgot{" "}
            <a href="#" style={{ textDecoration: "none", color: "white" }}>
              {" "}
              password
            </a>
            ?
          </p>
          <div className="d-grid gap-2 mt-3">
            <input
              className="btn btn-primary"
              type="submit"
              onClick={submit}
              value="login"
            />
          </div>
        </form>
      </div>
    </SignInStyle>
  );
};

const SignInStyle = styled.div`
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
  .forgot-password {
    margin-bottom: 0;
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
`;
export default SignInPage;

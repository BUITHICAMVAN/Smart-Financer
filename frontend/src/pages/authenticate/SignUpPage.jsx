import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { http } from "../../utils/Config";

const SignUpPage = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [currencyUnit, setCurrencyUnit] = useState();
  const navigate = useNavigate();
  const submit = async (e) => {
    try {
      await http
        .post("http://localhost:3000/api/user/signup", {
          username,
          email,
          password,
          currencyUnit,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 201 || res.data === "User created successfully") {
            navigate("/signin-page");
          }
        })
        .catch((e) => {
          alert("Wrong inputs!");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <SignUpStyle>
      <div className="container">
        <div className="header">
          <div className="text">Sign Up</div>
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
          <div className="input">
            <span className="label-value">Currency Unit</span>
            <div className="input-value">
              <input
                type="number"
                onChange={(e) => {
                  setCurrencyUnit(e.target.value);
                }}
                placeholder=""
              />
            </div>
          </div>
          <div className="d-grid gap-2 mt-3">
            <input
              className="btn btn-primary"
              type="submit"
              onClick={submit}
              value="signup"
            />
          </div>
        </form>
      </div>
    </SignUpStyle>
  );
};

const SignUpStyle = styled.div``;

export default SignUpPage;

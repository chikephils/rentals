import React, { useState } from "react";
import "../styles/Login.scss";
import axios from "axios";
import { server } from "../server";
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${server}/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch(
          setLogin({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate("/");
      } else {
        console.log("failed to login");
      }
    } catch (err) {
      console.log("Login Failed", err.message);
    }
  };
  return (
    <div className="login">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" />
      </Link>
      <div className="login_content">
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="pssword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">LOGIN</button>
        </form>
        <Link to="/register"> Don't have an account? Register Here </Link>
      </div>
    </div>
  );
};

export default LoginPage;

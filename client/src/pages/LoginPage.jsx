import React, { useState } from "react";
import "../styles/Login.scss";
import axios from "axios";
import { server } from "../server";
import { setLogin } from "../redux/user";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
        console.log("failed to login");
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log("Login Failed", err.message);
    } finally {
      setLoading(false);
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Please Wait..." : "LOGIN"}
          </button>
        </form>
        <Link to="/register"> Don't have an account? Register Here </Link>
      </div>
      <div className="login_loginInfo">
        <p>Email: chikephils@gmail.com</p>
        <p>Password: bellamy</p>
      </div>
    </div>
  );
};

export default LoginPage;

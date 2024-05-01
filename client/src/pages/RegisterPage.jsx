import React, { useEffect, useState } from "react";
import "../styles/Register.scss";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../server";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Check if a file is uploaded
    if (files && files.length > 0) {
      const reader = new FileReader();

      reader.onload = () => {
        // Set the state with the file content (reader.result)
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: name === "profileImage" ? reader.result : value,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  }, [formData.confirmPassword, formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const registerForm = new FormData();

      for (var key in formData) {
        registerForm.append(key, formData[key]);
      }

      const response = await axios.post(
        `${server}/auth/register`,
        registerForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
        console.log("failed to Register");
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log("Registration failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <Link to="/">
        <img src="/assets/logo.png" alt="logo" />
      </Link>
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords do not match</p>
          )}
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <FiUpload size={30} />
            <p>Upload Your Photo</p>
          </label>
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="profile pics"
              style={{ borderRadius: "50%", maxWidth: "70px", maxHeight: "80px" }}
            />
          ) : (
            <RxAvatar
              style={{ width: "60px", height: "60px", color: "white" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch || loading}>
            {loading ? "Please Wait..." : "REGISTER"}
          </button>
        </form>
        <Link to="/login">Already have an account? Log in Here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;

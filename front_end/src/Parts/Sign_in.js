import keyIcon from './key.png';
import React, { useState } from "react";
import "./Sign_in.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${API_URL}api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login successful!");
        // Save the accessToken in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        console.log(data);

        localStorage.setItem("userInfo", JSON.stringify({ name: data.name, userId: data.id }));

        // Redirect to the dashboard
        navigate("/dashboard");
      } else {
        // Handle errors, such as invalid credentials
        toast.error(data.message || "Login unsuccessful. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error. Please try again later.");
    }
  };

  // Redirect to the register page
  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
      <img src={keyIcon} alt="Key Icon"   className="login-icon" />


        <h2 className="login-title">Log In</h2>
        <div className="form-group">
  <input
    type="email"
    id="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <input
    type="password"
    id="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
</div>

        <button type="submit" className="login-button">
          Sign In
        </button>
        <button type="button" onClick={navigateToRegister} className="login-button">
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;

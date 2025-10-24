import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import keyIcon from "./key.png"; 

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <img src={keyIcon} alt="Key Icon" className="welcome-icon" />
        <h1 className="welcome-title">APM</h1>
        <p className="welcome-subtitle">Advanced<br />Password Manager</p>
        <button className="register-btn" onClick={() => navigate("/register")}>Create a New Account</button>
        <p className="login-text">Already have an account?</p>
        <button className="login-btn" onClick={() => navigate("/login")}>Log In</button>
      </div>
    </div>
  );
};

export default Welcome;

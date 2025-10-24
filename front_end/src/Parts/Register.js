import zxcvbn from "zxcvbn";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Sign_in.css"; 
import keyIcon from './key.png'; 

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordScore, setPasswordScore] = useState(null);
  const navigate = useNavigate();
  const getStrengthLabel = (score) => {
    switch (score) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };
  
  const getStrengthColor = (score) => {
    return ["#d9534f", "#f0ad4e", "#f7e463", "#5bc0de", "#5cb85c"][score];
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    if (name === "password") {
      const strength = zxcvbn(value);
      setPasswordScore(strength.score); // 0 (weak) to 4 (strong)
    }
    
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = process.env.REACT_APP_API_URL;

    if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed. Please try again!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={keyIcon} alt="Key Icon" className="login-icon" />
        <h2 className="login-title">Create an Account</h2>

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password (minimum 8 characters)"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        {passwordScore !== null && (
  <div style={{ marginTop: "8px", fontSize: "14px" }}>
    Password strength:{" "}
    <strong style={{ color: getStrengthColor(passwordScore) }}>
      {getStrengthLabel(passwordScore)}
    </strong>
  </div>
)}

        <button type="submit" className="login-button">
          Register
        </button>
        <button type="button" onClick={navigateToLogin} className="login-button">
          Log In
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;

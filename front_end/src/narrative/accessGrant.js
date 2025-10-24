import React, { useState, useEffect } from "react";
import accessNarrative from "./accessNarrative";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if the user is logged in (e.g., check localStorage for an access token)
    // and set the user state accordingly.
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // verify the token validity with your backend or decode it to get user data
      setUser({ accessToken });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/login");
  };

  return <accessNarrative.Provider value={{ user, logout }}>{children}</accessNarrative.Provider>;
};

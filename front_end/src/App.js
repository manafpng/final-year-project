import Welcome from "./Parts/Welcome";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { accessGrant } from "./narrative/accessGrant";
import Login from "./Parts/Sign_in";
import Dashboard from "./Parts/MainPage";
import Register from "./Parts/Register";

//paths

function App() {
  return (
    <Router>
      <accessGrant> 
        <Routes>
        <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </accessGrant>
    </Router>
  );
}
//end
export default App;

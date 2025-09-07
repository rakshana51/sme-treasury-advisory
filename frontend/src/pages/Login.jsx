// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      alert("Login failed");
    }
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "Arial, sans-serif",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "300px",
  };

  const inputStyle = {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={titleStyle}>Login</h2>
        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={buttonStyle} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else if (data.errors) {
        setError(data.errors.map((err) => err.msg).join(", "));
      } else {
        setError(data.msg || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Signup</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

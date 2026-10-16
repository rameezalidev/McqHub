import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./LogIn.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if(data.user.role == 'user') {
          navigate("/dashboard");
      }else if(data.user.role=='admin') {
        navigate('/admin')
      }
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    }
  }

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="auth-text">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>

          <button type="submit" className="auth-button primary-btn">
            Log In
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default LogIn;

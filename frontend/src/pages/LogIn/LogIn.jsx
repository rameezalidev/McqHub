import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./LogIn.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
console.log(API_URL)
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

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

      toast.success("Login successful! Welcome back.");

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errMsg = error.message || "Something went wrong";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Visual Column */}
        <div className="auth-side-brand">
          <div className="auth-logo-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="currentColor" />
              <path d="M5 13.18V17.18C5 19.94 8.13 22.18 12 22.18C15.87 22.18 19 19.94 19 17.18V13.18L12 17L5 13.18Z" fill="currentColor" opacity="0.8" />
            </svg>
            <div>
              <h3>MCQHub</h3>
              <p>Learn • Practice • Improve</p>
            </div>
          </div>

          <div className="auth-hero-text">
            <h2>Welcome Back</h2>
            <p>Your next big step is just a login away.</p>
          </div>

          <div className="auth-illustration">
            <svg viewBox="0 0 320 220" width="100%" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="160" cy="180" rx="140" ry="24" fill="#EDE9FE" />
              <rect x="70" y="110" width="160" height="40" rx="6" fill="#8B5CF6" />
              <rect x="80" y="90" width="150" height="22" rx="4" fill="#C4B5FD" />
              <rect x="90" y="70" width="140" height="22" rx="4" fill="#A78BFA" />
              <rect x="65" y="145" width="170" height="12" rx="3" fill="#6D28D9" />
              <path d="M160 30L210 50L160 70L110 50L160 30Z" fill="#5B21B6" />
              <path d="M210 50V75" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
              <circle cx="210" cy="78" r="4" fill="#F59E0B" />
              <path d="M135 59V76C135 84 185 84 185 76V59" fill="#4C1D95" />
              <circle cx="250" cy="155" r="14" fill="#FFEDD5" />
              <path d="M250 145V155L257 159" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="auth-side-form">
          <div className="auth-tabs">
            <button type="button" className="auth-tab active">
              Login
            </button>
            <button type="button" className="auth-tab" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>

          <div className="auth-header">
            <h3>Login to your account</h3>
            <p>Welcome back! Please enter your details.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {message && <div className="form-alert">{message}</div>}

            <button type="submit" className="button button-primary auth-submit" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>

            <div className="auth-footer">
              <span>Don&apos;t have an account? </span>
              <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;

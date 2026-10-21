import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthIllustration, BrandLogoIcon } from "../../components/icons/Icons";
import "./LogIn.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
            <BrandLogoIcon width="28" height="28" />
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
            <AuthIllustration />
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

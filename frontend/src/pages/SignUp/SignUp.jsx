import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthIllustration, BrandLogoIcon } from "../../components/icons/Icons";
import "./SignUp.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (password !== confirmPassword) {
      const msg = "Passwords do not match!";
      setMessage(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setIsSuccess(true);
      const successMsg = "Account created successfully! Redirecting to login...";
      setMessage(successMsg);
      toast.success(successMsg);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errMsg = error.message || "Something went wrong";
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
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
            <h2>Create your account</h2>
            <p>Join MCQHub and start your learning journey today.</p>
          </div>

          <div className="auth-illustration">
            <AuthIllustration />
          </div>
        </div>

        {/* Right Form Column */}
        <div className="auth-side-form">
          <div className="auth-tabs">
            <button type="button" className="auth-tab" onClick={() => navigate("/login")}>
              Login
            </button>
            <button type="button" className="auth-tab active">
              Sign Up
            </button>
          </div>

          <div className="auth-header">
            <h3>Start practicing today</h3>
            <p>Create your free student account in seconds.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <input
                  className="input-field"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
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

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {message && (
              <div className={`form-alert ${isSuccess ? "alert-success" : "alert-error"}`}>
                {message}
              </div>
            )}

            <button type="submit" className="button button-primary auth-submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account →"}
            </button>

            <div className="auth-footer">
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

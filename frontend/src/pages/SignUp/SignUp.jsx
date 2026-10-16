import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import "./SignUp.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.name]: action.value,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

function SignUp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    dispatch({
      type: "CHANGE_INPUT",
      name: e.target.name,
      value: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (state.password !== state.confirmPassword) {
      setMessage("Passwords do not match!");
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
          name: state.name,
          email: state.email,
          password: state.password,
          confirmPassword: state.confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage(data.message || "User created successfully!");
      dispatch({ type: "RESET" });
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell auth-page">
      <div className="auth-card">
        <h1>Sign Up</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="name"
            placeholder="Enter name..."
            value={state.name}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Enter email..."
            value={state.email}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Enter password..."
            value={state.password}
            onChange={handleChange}
          />

          <input
            className="auth-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password..."
            value={state.confirmPassword}
            onChange={handleChange}
          />

          <p className="auth-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          <button type="submit" className="auth-button primary-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default SignUp;

import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { AUTH_TEXT } from "../../../constants/app";

function AuthFormPanel({
  email,
  password,
  showPassword,
  message,
  loading,
  setEmail,
  setPassword,
  setShowPassword,
  handleSubmit,
  navigate,
}) {
  return (
    <div className="auth-side-form">
      <div className="auth-tabs">
        <button type="button" className="auth-tab active">
          Login
        </button>
        <button type="button" className="auth-tab" onClick={() => navigate(ROUTES.SIGNUP)}>
          Sign Up
        </button>
      </div>

      <div className="auth-header">
        <h3>{AUTH_TEXT.PAGE_TITLE}</h3>
        <p>{AUTH_TEXT.PAGE_DESCRIPTION}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{AUTH_TEXT.EMAIL_LABEL}</label>
          <div className="input-wrapper">
            <input
              className="input-field"
              type="email"
              placeholder={AUTH_TEXT.EMAIL_PLACEHOLDER}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>{AUTH_TEXT.PASSWORD_LABEL}</label>
          <div className="input-wrapper">
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder={AUTH_TEXT.PASSWORD_PLACEHOLDER}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? AUTH_TEXT.HIDE_PASSWORD : AUTH_TEXT.SHOW_PASSWORD}
            </button>
          </div>
        </div>

        {message && <div className="form-alert">{message}</div>}

        <button type="submit" className="button button-primary auth-submit" disabled={loading}>
          {loading ? AUTH_TEXT.LOGGING_IN_BUTTON : AUTH_TEXT.LOGIN_BUTTON}
        </button>

        <div className="auth-footer">
          <span>{AUTH_TEXT.NO_ACCOUNT_TEXT} </span>
          <Link to={ROUTES.SIGNUP}>{AUTH_TEXT.SIGN_UP_LINK}</Link>
        </div>
      </form>
    </div>
  );
}

export default AuthFormPanel;

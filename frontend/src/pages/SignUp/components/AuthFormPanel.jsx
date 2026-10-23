import { Link } from "react-router-dom";
import { AUTH_TEXT } from "../../../constants/auth";
import { ROUTES } from "../../../constants/routes";

function AuthFormPanel({ formState, dispatch, handleSubmit, navigate }) {
  const {
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    message,
    isSuccess,
    isSubmitting,
  } = formState;

  return (
    <div className="auth-side-form">
      <div className="auth-tabs">
        <button type="button" className="auth-tab" onClick={() => navigate(ROUTES.LOGIN)}>
          {AUTH_TEXT.LOGIN_TAB}
        </button>
        <button type="button" className="auth-tab active">
          {AUTH_TEXT.SIGNUP_TAB}
        </button>
      </div>

      <div className="auth-header">
        <h3>{AUTH_TEXT.PAGE_TITLE}</h3>
        <p>{AUTH_TEXT.PAGE_DESCRIPTION}</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{AUTH_TEXT.FULL_NAME_LABEL}</label>
          <div className="input-wrapper">
            <input
              className="input-field"
              type="text"
              placeholder={AUTH_TEXT.FULL_NAME_PLACEHOLDER}
              value={name}
              onChange={(e) =>
                dispatch({ type: "FIELD_CHANGE", field: "name", value: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>{AUTH_TEXT.EMAIL_LABEL}</label>
          <div className="input-wrapper">
            <input
              className="input-field"
              type="email"
              placeholder={AUTH_TEXT.EMAIL_PLACEHOLDER}
              value={email}
              onChange={(e) =>
                dispatch({ type: "FIELD_CHANGE", field: "email", value: e.target.value })
              }
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
              onChange={(e) =>
                dispatch({ type: "FIELD_CHANGE", field: "password", value: e.target.value })
              }
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => dispatch({ type: "TOGGLE_PASSWORD_VISIBILITY" })}
              aria-label="Toggle password visibility"
            >
              {showPassword ? AUTH_TEXT.HIDE_PASSWORD : AUTH_TEXT.SHOW_PASSWORD}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>{AUTH_TEXT.CONFIRM_PASSWORD_LABEL}</label>
          <div className="input-wrapper">
            <input
              className="input-field"
              type={showPassword ? "text" : "password"}
              placeholder={AUTH_TEXT.CONFIRM_PASSWORD_PLACEHOLDER}
              value={confirmPassword}
              onChange={(e) =>
                dispatch({
                  type: "FIELD_CHANGE",
                  field: "confirmPassword",
                  value: e.target.value,
                })
              }
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
          {isSubmitting ? AUTH_TEXT.CREATING_ACCOUNT_BUTTON : AUTH_TEXT.CREATE_ACCOUNT_BUTTON}
        </button>

        <div className="auth-footer">
          <span>{AUTH_TEXT.ALREADY_HAVE_ACCOUNT_TEXT} </span>
          <Link to={ROUTES.LOGIN}>{AUTH_TEXT.LOGIN_LINK}</Link>
        </div>
      </form>
    </div>
  );
}

export default AuthFormPanel;

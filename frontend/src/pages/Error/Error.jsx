import { useNavigate } from "react-router-dom";
import "./Error.css";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon-box">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <span className="error-code-badge">404 Error</span>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-description">
          The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
        </p>
        <button
          type="button"
          className="button button-primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default Error;

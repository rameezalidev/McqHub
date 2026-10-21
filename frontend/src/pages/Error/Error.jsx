import { useNavigate } from "react-router-dom";
import { ErrorIcon } from "../../components/icons/Icons";
import "./Error.css";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon-box">
          <ErrorIcon />
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
          Back to Dashboard 
        </button>
      </div>
    </div>
  );
}

export default Error;

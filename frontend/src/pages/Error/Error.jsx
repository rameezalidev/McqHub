import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error.css";

function Error() {
  const navigate = useNavigate();

  return (
    <div className="page-shell error-page">
      <div className="error-card">
        <p className="error-code">404</p>
        <h1>Page Not Found</h1>
        <button type="button" className="primary-btn" onClick={() => navigate("/login")}>
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Error;

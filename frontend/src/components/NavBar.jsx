import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar({ showDashboardLink = true }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => showDashboardLink && navigate("/dashboard")}>
          <div className="navbar-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="currentColor" />
              <path d="M5 13.18V17.18C5 19.94 8.13 22.18 12 22.18C15.87 22.18 19 19.94 19 17.18V13.18L12 17L5 13.18Z" fill="currentColor" opacity="0.8" />
            </svg>
          </div>
          <div className="navbar-title">
            <span className="brand-name">MCQHub</span>
            <span className="brand-tagline">Learn • Practice • Improve</span>
          </div>
        </div>

        <div className="navbar-actions">
          {user.name && (
            <div className="user-profile-badge">
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user.name}</span>
            </div>
          )}

          {showDashboardLink && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          )}

          <button
            type="button"
            className="button button-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
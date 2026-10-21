import { useNavigate } from "react-router-dom";
import { BrandLogoIcon } from "./icons/Icons";
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
            <BrandLogoIcon width="24" height="24" />
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
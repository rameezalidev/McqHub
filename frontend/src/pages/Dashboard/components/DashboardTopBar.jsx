import { SearchIcon } from "../../../components/icons/Icons";

function DashboardTopBar({ searchQuery, onSearchChange, onClearSearch }) {
  return (
    <div className="dashboard-topbar">
      <div className="search-box">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {searchQuery && (
          <button type="button" className="search-clear-btn" onClick={onClearSearch}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default DashboardTopBar;

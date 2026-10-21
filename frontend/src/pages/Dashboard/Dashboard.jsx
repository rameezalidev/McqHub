import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";
import CategoryCard from "../../components/CategoryCard";
import HistoryItem from "../../components/HistoryItem";
import NavBar from "../../components/NavBar";
import { EmptyHistoryIcon, SearchIcon } from "../../components/icons/Icons";
import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // Redirect if an active quiz is already in progress
  useEffect(() => {
    const activeQuizId = localStorage.getItem("active_quiz_id");
    if (activeQuizId) {
      navigate(`/quiz/${activeQuizId}`, { replace: true });
    }
  }, [navigate]);

  // Load Dashboard Data
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        // Fetch Categories
        const catRes = await fetch(`${API_URL}/api/users/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const catData = await catRes.json();

        // Fetch Stats
        const statsRes = await fetch(`${API_URL}/api/users/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();

        // Fetch History
        const histRes = await fetch(`${API_URL}/api/users/quizzes/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const histData = await histRes.json();

        if (isMounted) {
          setCategories(catData.data || []);
          setStats(statsData || {});
          setHistory(histData.data || []);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Refresh data after deleting a history record
  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_URL}/api/users/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete quiz history");
      }

      // Refresh history list
      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success("Quiz attempt removed from history");

      // Refresh stats
      const statsRes = await fetch(`${API_URL}/api/users/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statsData = await statsRes.json();
      setStats(statsData || {});
    } catch (error) {
      console.error("Delete history error:", error);
      toast.error(error.message || "Failed to delete attempt");
    }
  }

  // Filter categories based on search input
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((cat) =>
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  return (
    <>
      <NavBar showDashboardLink={false} />

      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Top Search & Filter Bar */}
          <div className="dashboard-topbar">
            <div className="search-box">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Hero Welcome Banner */}
          <div className="dashboard-hero">
            <div className="hero-content">
              <h2 className="hero-title">
                Good day, {user.name || "Student"}
              </h2>
              <p className="hero-subtitle">
                Ready to test your knowledge? Pick a category and challenge yourself today.
              </p>
              <a href="#categories-section" className="button button-primary hero-cta-btn">
                Start a Quiz →
              </a>
            </div>

           
          </div>

          {/* Stats Row */}
          <div className="dashboard-stats-row">
            <StatCard
              label="Total Quizzes Taken"
              value={stats.totalQuizzes || 0}
              subtext="+0 this week"
            />
            <StatCard
              label="Overall Accuracy"
              value={`${stats.accuracy || 0}%`}
              subtext="+0% this week"
            />
            <StatCard
              label="Best Quiz Score"
              value={`${stats.bestPercentage || 0}%`}
              subtext="+0% this week"
            />
          </div>

          {/* Categories Section */}
          <section id="categories-section" className="dashboard-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">Explore Categories</h3>
                <p className="section-subtitle">Choose a topic and start practicing.</p>
              </div>
              <span className="section-count">{filteredCategories.length} available</span>
            </div>

            {loading ? (
              <div className="loading-card">
                <div className="spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : filteredCategories.length > 0 ? (
              <div className="categories-flex-wrap">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category._id}
                    name={category.name}
                    onClick={() => navigate(`/quiz/${category._id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state-card">
                <p className="empty-state-title">No categories found</p>
                <p className="empty-state-text">
                  {searchQuery ? `No categories match "${searchQuery}"` : "No categories are currently available."}
                </p>
              </div>
            )}
          </section>

          {/* Recent Quiz Attempts / History Section */}
          <section className="dashboard-section">
            <div className="section-header">
              <div>
                <h3 className="section-title">Recent Quiz Attempts</h3>
                <p className="section-subtitle">Review your past scores and performance.</p>
              </div>
              <span className="section-count">{history.length} attempts</span>
            </div>

            {history.length > 0 ? (
              <div className="history-flex-list">
                {history.map((item) => (
                  <HistoryItem
                    key={item._id}
                    score={item.score}
                    totalQuestions={item.totalQuestions || 10}
                    createdAt={item.createdAt}
                    onDelete={() => handleDelete(item._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state-card">
                <div className="empty-icon">
                  <EmptyHistoryIcon />
                </div>
                <p className="empty-state-title">No quiz attempts yet</p>
                <p className="empty-state-text">
                  Start your first quiz above to see your history and tracked progress here.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Dashboard;

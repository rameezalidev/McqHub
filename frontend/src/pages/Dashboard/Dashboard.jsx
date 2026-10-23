import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import { ROUTES } from "../../constants/routes";
import { useFetch } from "../../hooks/useFetch";
import DashboardTopBar from "./components/DashboardTopBar";
import DashboardHero from "./components/DashboardHero";
import DashboardStats from "./components/DashboardStats";
import CategoriesSection from "./components/CategoriesSection";
import HistorySection from "./components/HistorySection";
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
  const { execute } = useFetch();

  useEffect(() => {
    const activeQuizId = localStorage.getItem("active_quiz_id");
    if (activeQuizId) {
      navigate(ROUTES.QUIZ.replace(":categoryId", activeQuizId), { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        const [catRes, statsRes, histRes] = await Promise.all([
          execute({
            url: `${API_URL}/api/users/categories`,
            headers: { Authorization: `Bearer ${token}` },
            throwOnError: false,
          }),
          execute({
            url: `${API_URL}/api/users/dashboard/stats`,
            headers: { Authorization: `Bearer ${token}` },
            throwOnError: false,
          }),
          execute({
            url: `${API_URL}/api/users/quizzes/history`,
            headers: { Authorization: `Bearer ${token}` },
            throwOnError: false,
          }),
        ]);

        if (isMounted) {
          setCategories(catRes.data?.data || []);
          setStats(statsRes.data || {});
          setHistory(histRes.data?.data || []);
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
  }, [execute, token]);

  async function handleDelete(id) {
    try {
      const res = await execute({
        url: `${API_URL}/api/users/quizzes/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        throwOnError: false,
      });

      if (!res.response.ok) {
        throw new Error("Failed to delete quiz history");
      }

      setHistory((prev) => prev.filter((item) => item._id !== id));
      toast.success("Quiz attempt removed from history");

      const statsRes = await execute({
        url: `${API_URL}/api/users/dashboard/stats`,
        headers: { Authorization: `Bearer ${token}` },
        throwOnError: false,
      });
      setStats(statsRes.data || {});
    } catch (error) {
      console.error("Delete history error:", error);
      toast.error(error.message || "Failed to delete attempt");
    }
  }

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    return categories.filter((category) =>
      category.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  function handleSelectCategory(categoryId) {
    navigate(ROUTES.QUIZ.replace(":categoryId", categoryId));
  }

  function handleStartQuiz() {
    document.getElementById("categories-section")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <NavBar showDashboardLink={false} />

      <div className="dashboard-page">
        <div className="dashboard-container">
          <DashboardTopBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={() => setSearchQuery("")}
          />

          <DashboardHero userName={user.name} onStartQuiz={handleStartQuiz} />

          <DashboardStats stats={stats} />

          <CategoriesSection
            loading={loading}
            filteredCategories={filteredCategories}
            searchQuery={searchQuery}
            onSelectCategory={handleSelectCategory}
          />

          <HistorySection history={history} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;

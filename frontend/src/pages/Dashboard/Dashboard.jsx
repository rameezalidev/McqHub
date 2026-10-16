import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard";
import CategoryCard from "../../components/CategoryCard";
import HistoryItem from "../../components/HistoryItem";
import "./Dashboard.css";
import NavBar from "../../components/NavBar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Dashboard() {
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({});
    const [history, setHistory] = useState({});
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    async function initializeDashboard() {
        try {
            const response = await fetch(`${API_URL}/api/users/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setStats(data || {});
        } catch (error) {
            console.error(error);
        }
    }

    async function getQuizHistory() {
        try {
            const response = await fetch(`${API_URL}/api/users/quizzes/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setHistory(data || {});
        } catch (error) {
            console.error(error);
        }
    }
    async function getCategories() {
        try {
            const response = await fetch(`${API_URL}/api/users/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setCategories(data.data || []);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getCategories();
        initializeDashboard();
        getQuizHistory();
    }, [token]);


    async function handleDelete(id) {
        try {
            const response = await fetch(`${API_URL}/api/users/quizzes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await response.json();
            getQuizHistory();
            initializeDashboard();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
        <NavBar />
        
        <div>
            
            <div className="page-card">
                <div className="page-header">
                    <h1>Dashboard</h1>
                </div>

                <div className="stats-grid">
                    <StatCard label="Quiz Count" value={stats.totalQuizzes || 0} />
                    <StatCard label="Quiz Accuracy" value={`${stats.accuracy || 0}%`} />
                    <StatCard label="Best Percentage" value={`${stats.bestPercentage || 0}%`} />
                </div>

                <div className="section-block">
                    <h3>Categories</h3>
                    {categories.length > 0 ? (
                        <div className="category-list">
                            {categories.map((category) => (
                                <CategoryCard
                                    key={category._id}
                                    name={category.name}
                                    onClick={() => navigate(`/quiz/${category._id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No categories available right now.</p>
                    )}
                </div>

                <div className="section-block">
                    <h3>History</h3>
                    {history.data?.length > 0 ? (
                        <div className="history-list">
                            {history.data.map((item) => (
                                <HistoryItem
                                    key={item._id}
                                    score={item.score}
                                    createdAt={item.createdAt}
                                    onDelete={() => handleDelete(item._id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-state">No quiz history yet.</p>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default Dashboard;

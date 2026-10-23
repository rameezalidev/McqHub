import StatCard from "../../../components/StatCard";

function DashboardStats({ stats }) {
  return (
    <div className="dashboard-stats-row">
      <StatCard label="Total Quizzes Taken" value={stats.totalQuizzes || 0} subtext="+0 this week" />
      <StatCard label="Overall Accuracy" value={`${stats.accuracy || 0}%`} subtext="+0% this week" />
      <StatCard label="Best Quiz Score" value={`${stats.bestPercentage || 0}%`} subtext="+0% this week" />
    </div>
  );
}

export default DashboardStats;

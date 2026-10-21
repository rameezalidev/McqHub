import { StatCardIcon } from "./icons/Icons";
import "./StatCard.css";

function getStatIcon(label) {
  const lower = (label || "").toLowerCase();
  if (lower.includes("count") || lower.includes("total") || lower.includes("quizzes")) {
    return <StatCardIcon type="count" />;
  }
  if (lower.includes("accuracy")) {
    return <StatCardIcon type="accuracy" />;
  }
  return <StatCardIcon type="score" />;
}

function StatCard({ label, value}) {
  const icon = getStatIcon(label);

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon-wrapper">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default StatCard;

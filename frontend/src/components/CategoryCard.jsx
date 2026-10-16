function getCategoryIcon(name) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("web") || lower.includes("dev") || lower.includes("html")) {
    return "</>";
  }
  if (lower.includes("javascript") || lower.includes("js")) {
    return "JS";
  }
  if (lower.includes("data") || lower.includes("sql") || lower.includes("db") || lower.includes("mongo")) {
    return "DB";
  }
  if (lower.includes("ai") || lower.includes("machine") || lower.includes("intelligence")) {
    return "AI";
  }
  if (lower.includes("computer") || lower.includes("science") || lower.includes("cs")) {
    return "CS";
  }
  return "MCQ";
}

function CategoryCard({ name, onClick }) {
  const iconText = getCategoryIcon(name);

  return (
    <div className="category-card" onClick={onClick}>
      <div className="category-card-top">
        <div className={`category-icon-badge badge-${iconText.toLowerCase()}`}>
          <span>{iconText}</span>
        </div>
        <span className="category-badge">Active</span>
      </div>

      <div className="category-card-body">
        <h4 className="category-title">{name}</h4>
        <p className="category-meta">10 questions</p>
      </div>

      <div className="category-card-footer">
        <span className="category-action-link">Start Quiz →</span>
      </div>
    </div>
  );
}

export default CategoryCard;

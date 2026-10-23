function DashboardHero({ userName, onStartQuiz }) {
  return (
    <div className="dashboard-hero">
      <div className="hero-content">
        <h2 className="hero-title">Good day, {userName || "Student"}</h2>
        <p className="hero-subtitle">
          Ready to test your knowledge? Pick a category and challenge yourself today.
        </p>
        <button type="button" className="button button-primary hero-cta-btn" onClick={onStartQuiz}>
          Start a Quiz →
        </button>
      </div>
    </div>
  );
}

export default DashboardHero;

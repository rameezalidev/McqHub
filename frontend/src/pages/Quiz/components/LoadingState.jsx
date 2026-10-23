function LoadingState() {
  return (
    <div className="quiz-loading-state">
      <div className="spinner"></div>
      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "8px", color: "var(--text-main)" }}>
        Loading Quiz Questions...
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
        Generating Quiz...
      </p>
    </div>
  );
}

export default LoadingState;

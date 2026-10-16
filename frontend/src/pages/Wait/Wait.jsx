function Wait() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "16px",
      }}
    >
      <div className="spinner"></div>
      <p style={{ fontWeight: 600, color: "var(--text-muted)" }}>
        Generating Quiz... Please wait.
      </p>
    </div>
  );
}

export default Wait;
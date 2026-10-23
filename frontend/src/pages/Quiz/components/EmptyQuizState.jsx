import { NoQuestionsIcon } from "../../../components/icons/Icons";

function EmptyQuizState({ categoryName, onBack }) {
  return (
    <div className="empty-state-card" style={{ padding: "40px 24px", textAlign: "center" }}>
      <div className="empty-icon" style={{ marginBottom: "14px", color: "var(--accent)" }}>
        <NoQuestionsIcon />
      </div>
      <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 8px", color: "var(--text-main)" }}>
        No Questions Found
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "24px", maxWidth: "420px" }}>
        No questions are currently available for <strong>{categoryName || "this category"}</strong>
      </p>
      <button type="button" className="button button-primary" onClick={onBack}>
        ← Return to Dashboard
      </button>
    </div>
  );
}

export default EmptyQuizState;

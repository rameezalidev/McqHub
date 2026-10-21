function formatDate(date) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsedDate);
}

function HistoryItem({ score, totalQuestions = 10, createdAt, onDelete }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="history-item">
      <div className="history-item-left">
        <div className="history-score-badge">
          <span className="history-score-number">{score}</span>
          <span className="history-score-total">/{totalQuestions}</span>
        </div>
        <div className="history-details">
          <div className="history-percentage-tag">{percentage}% Score</div>
          <div className="history-date">{formatDate(createdAt)}</div>
        </div>
      </div>

      <button type="button" className="button button-danger history-delete-btn" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

export default HistoryItem;

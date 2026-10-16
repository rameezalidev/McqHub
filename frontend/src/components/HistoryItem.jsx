function HistoryItem({ score, createdAt, onDelete }) {
  return (
    <div className="history-item">
      <div>
        <p className="history-score">{score}/10</p>
        <p className="history-date">{createdAt}</p>
      </div>
      <button type="button" className="secondary-btn" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}

export default HistoryItem;

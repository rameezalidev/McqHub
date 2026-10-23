import HistoryItem from "../../../components/HistoryItem";
import { EmptyHistoryIcon } from "../../../components/icons/Icons";

function HistorySection({ history, onDelete }) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div>
          <h3 className="section-title">Recent Quiz Attempts</h3>
          <p className="section-subtitle">Review your past scores and performance.</p>
        </div>
        <span className="section-count">{history.length} attempts</span>
      </div>

      {history.length > 0 ? (
        <div className="history-flex-list">
          {history.map((item) => (
            <HistoryItem
              key={item._id}
              score={item.score}
              totalQuestions={item.totalQuestions || 10}
              createdAt={item.createdAt}
              onDelete={() => onDelete(item._id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <div className="empty-icon">
            <EmptyHistoryIcon />
          </div>
          <p className="empty-state-title">No quiz attempts yet</p>
          <p className="empty-state-text">
            Start your first quiz above to see your history and tracked progress here.
          </p>
        </div>
      )}
    </section>
  );
}

export default HistorySection;

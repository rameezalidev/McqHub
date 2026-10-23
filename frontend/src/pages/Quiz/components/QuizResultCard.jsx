import { TrophyIcon } from "../../../components/icons/Icons";

function QuizResultCard({ result, handleRetake, handleBackToDashboard }) {
  return (
    <div className="result-card">
      <div className="result-header">
        <div className="result-trophy-icon">
          <TrophyIcon />
        </div>
        <h2 className="result-title">Quiz Completed!</h2>
        <p className="result-subtitle">
          {result.percentage >= 80
            ? "Outstanding performance! You have mastered this quiz."
            : result.percentage >= 50
            ? "Good effort! Keep practicing to improve your score."
            : "Nice try! Review the topics and try again to achieve mastery."}
        </p>
      </div>

      <div className="result-score-highlight">
        <div className="result-score-circle">
          <span className="result-score-number">{result.score || 0}</span>
          <span className="result-score-denominator">/ {result.totalQuestions || 10}</span>
        </div>
        <div className="result-accuracy-badge">{result.percentage || 0}% Accuracy</div>
      </div>

      <div className="result-stats-row">
        <div className="result-stat-box">
          <span className="result-stat-label">Total Questions</span>
          <strong className="result-stat-val">{result.totalQuestions || 10}</strong>
        </div>

        <div className="result-stat-box stat-correct">
          <span className="result-stat-label">Correct Answers</span>
          <strong className="result-stat-val">{result.score || 0}</strong>
        </div>

        <div className="result-stat-box stat-incorrect">
          <span className="result-stat-label">Incorrect Answers</span>
          <strong className="result-stat-val">{(result.totalQuestions || 10) - (result.score || 0)}</strong>
        </div>
      </div>

      <div className="result-actions-row">
        <button type="button" className="button button-secondary" onClick={handleRetake}>
          ↻ Retake Quiz
        </button>
        <button type="button" className="button button-primary" onClick={handleBackToDashboard}>
          Return to Dashboard →
        </button>
      </div>
    </div>
  );
}

export default QuizResultCard;

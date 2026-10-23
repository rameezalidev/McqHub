import { AutosaveIcon } from "../../../components/icons/Icons";

function QuizActionsRow({ currentQuestion, questionsLength, saveAndMove, handleSubmit, submitting }) {
  return (
    <div className="quiz-actions-row">
      <button
        type="button"
        className="button button-secondary quiz-prev-btn"
        onClick={() => saveAndMove("back")}
        disabled={currentQuestion <= 0}
      >
        ← Previous
      </button>

      <div className="quiz-autosave-indicator">
        <AutosaveIcon />
      </div>

      {currentQuestion < questionsLength - 1 ? (
        <button type="button" className="button button-primary quiz-next-btn" onClick={() => saveAndMove("next")}>
          Next Question →
        </button>
      ) : (
        <button type="button" className="button button-primary quiz-submit-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz →"}
        </button>
      )}
    </div>
  );
}

export default QuizActionsRow;

import QuizOption from "../../../components/QuizOption";

function QuizQuestionPanel({ currentQ, currentQuestion, selectedAnswer, handleSelectOption }) {
  if (!currentQ) return null;

  return (
    <div className="question-content">
      <div className="question-header">
        <span className="question-number-badge">Q{currentQuestion + 1}</span>
        <h3 className="question-title">{currentQ.question}</h3>
      </div>

      <ul className="option-list">
        {currentQ.options.map((option, idx) => (
          <QuizOption
            key={idx}
            index={idx}
            option={option}
            isSelected={selectedAnswer === option}
            onClick={() => handleSelectOption(option)}
          />
        ))}
      </ul>
    </div>
  );
}

export default QuizQuestionPanel;

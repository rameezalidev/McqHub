function QuizOption({ option, index, isSelected, onClick }) {
  const letters = ["A", "B", "C", "D"];
  const letter = index !== undefined && letters[index] ? letters[index] : null;

  return (
    <li
      className={`quiz-option ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="option-indicator">
        {isSelected ? (
          <div className="radio-circle-selected">
            <div className="radio-inner-dot"></div>
          </div>
        ) : (
          <div className="radio-circle">
            {letter && <span className="option-letter">{letter}</span>}
          </div>
        )}
      </div>
      <span className="option-text">{option}</span>
    </li>
  );
}

export default QuizOption;

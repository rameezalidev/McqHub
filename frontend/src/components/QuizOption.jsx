function QuizOption({ option, isSelected, onClick }) {
  return (
    <li className={isSelected ? "highlight" : ""} onClick={onClick}>
      {option}
    </li>
  );
}

export default QuizOption;

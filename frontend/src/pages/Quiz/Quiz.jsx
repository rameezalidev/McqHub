import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QuizOption from "../../components/QuizOption";
import "./Quiz.css";
import NavBar from "../../components/NavBar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const token = localStorage.getItem("token");

function Quiz() {
    const navigate = useNavigate()
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem(`questions_${categoryId}`) || "[]"));
  const [result, setResult] = useState({});
  const [show, setShow] = useState(false);
  const [answers, setAnswers] = useState(JSON.parse(localStorage.getItem(`answers_${categoryId}`) || "[]"));
  const [currentQuestion, setCurrentQuestion] = useState(JSON.parse(localStorage.getItem("current") || "0"));
  const [selectedAnswer, setSelectedAnswer] = useState(JSON.parse(localStorage.getItem("selectedAnswer"))||"");

  useEffect(() => {
    async function getQuestions() {
      if (!categoryId) return;

      const response = await fetch(`${API_URL}/api/users/categories/${categoryId}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);

      setQuestions(data.data || []);
      localStorage.setItem(`questions_${categoryId}`, JSON.stringify(data.data));
      setAnswers([]);
      setCurrentQuestion(0);
      setShow(false);
      setResult({});
    }
    function setLocalQuestion() {
        setQuestions(localQuestions);
    }
    const localQuestions = JSON.parse(localStorage.getItem(`questions_${categoryId}`) || "[]");
    if (localQuestions?.length === 0) {
      getQuestions();
    } 
    else {
        setLocalQuestion();
    }    
  }, [categoryId]);

  function handleSelectedAnswer(e) {
    if (e.target.tagName === "LI") {
      setSelectedAnswer(e.target.innerText);
    }
  }

  function saveAndMove(step, question) {
    if (!selectedAnswer && step === "next") {
      alert("Please select an answer");
      return;
    }

    setAnswers((prev) => {
      const questionId = question._id;
      const exists = prev.some((ans) => ans.questionId === questionId);

      if (exists) {
        return prev.map((ans) =>
          ans.questionId === questionId ? { ...ans, selectedAnswer } : ans
        );
      }

      return [
        ...prev,
        {
          questionId,
          selectedAnswer,
        },
      ];
    });

    localStorage.setItem(`answers_${categoryId}`, JSON.stringify(answers));

    setCurrentQuestion((current) => (step === "next" ? current + 1 : current - 1));

    const nextIndex = currentQuestion + (step === "next" ? 1 : -1);
    const nextQuestion = questions[nextIndex];
    const savedAnswer = answers.find((ans) => ans.questionId === nextQuestion?._id);

    localStorage.setItem("selectedAnswer", JSON.stringify(selectedAnswer));
    setSelectedAnswer(savedAnswer?.selectedAnswer || "");
  }

  useEffect(() => {
    localStorage.setItem("current", JSON.stringify(currentQuestion));
  }, [currentQuestion]);

  function clearQuizData() {
    localStorage.removeItem(`questions_${categoryId}`);
    localStorage.removeItem("current");
    localStorage.removeItem("selectedAnswer");
    localStorage.removeItem(`answers_${categoryId}`);
  }

  async function handleSubmit() {
      setResult({});
      const response = await fetch(`${API_URL}/api/users/quizzes/submit`, {
          method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, answers }),
});
const data = await response.json();
clearQuizData();
    setResult(data);
    setShow(true);
    
}
  return (<>
    <NavBar />
    <div className="page-shell quiz-page">
      <div className="quiz-card">
    <div className="navigation" onClick={()=>navigate('/dashboard')}>Dashboard</div>
        <div className="page-header">
          <h1>Quiz</h1>
        </div>



        <div className="quiz-meta">{currentQuestion + 1}/10</div>

        {questions[currentQuestion] && !show && (
          <div key={questions[currentQuestion]._id} className="question-card">
            <div className="question-text">{questions[currentQuestion].question}</div>
            <ol className="option-list" onClick={handleSelectedAnswer}>
              <QuizOption
                option={questions[currentQuestion].options[0]}
                isSelected={selectedAnswer === questions[currentQuestion].options[0]}
                onClick={handleSelectedAnswer}
              />
              <QuizOption
                option={questions[currentQuestion].options[1]}
                isSelected={selectedAnswer === questions[currentQuestion].options[1]}
                onClick={handleSelectedAnswer}
              />
              <QuizOption
                option={questions[currentQuestion].options[2]}
                isSelected={selectedAnswer === questions[currentQuestion].options[2]}
                onClick={handleSelectedAnswer}
              />
              <QuizOption
                option={questions[currentQuestion].options[3]}
                isSelected={selectedAnswer === questions[currentQuestion].options[3]}
                onClick={handleSelectedAnswer}
              />
            </ol>
          </div>
        )}

        {questions.length === 0 && <p className="empty-state">No Questions found for this Category</p>}

        {questions.length > 0 && !show && (
          <div className="action-row">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => saveAndMove("back", questions[currentQuestion])}
              disabled={currentQuestion <= 0}
            >
              Back
            </button>
            <button
              type="button"
              className="primary-btn"
              onClick={() => saveAndMove("next", questions[currentQuestion])}
              disabled={currentQuestion >= questions.length - 1}
            >
              Next
            </button>
            {currentQuestion === questions.length - 1 && (
              <button type="button" className="primary-btn" onClick={handleSubmit}>
                Submit Quiz
              </button>
            )}
          </div>
        )}

        {show && (
          <div className="result-card">
            <p>
              Score: <b>{result.score}</b>
            </p>
            <p>
              Percentage: <b>{result.percentage}</b>
            </p>
            <p>
              Total Questions: <b>{result.totalQuestions}</b>
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default Quiz;

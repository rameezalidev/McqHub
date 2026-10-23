import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import LoadingState from "./components/LoadingState";
import EmptyQuizState from "./components/EmptyQuizState";
import QuizTopBar from "./components/QuizTopBar";
import QuizQuestionPanel from "./components/QuizQuestionPanel";
import QuizActionsRow from "./components/QuizActionsRow";
import QuizResultCard from "./components/QuizResultCard";
import { useQuizSession } from "./hooks/useQuizSession";
import "./Quiz.css";

function Quiz() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const {
    loading,
    questions,
    categoryName,
    questionSource,
    currentQuestion,
    currentQ,
    selectedAnswer,
    timeLeft,
    show,
    submitting,
    result,
    progressPercent,
    formattedTimer,
    handleSelectOption,
    handleSubmit,
    saveAndMove,
    handleRetake,
    handleBackToDashboard,
  } = useQuizSession({ categoryId, token, navigate });

  return (
    <>
      <NavBar showDashboardLink={show || (!loading && questions.length === 0)} />

      <div className="quiz-page">
        <div className="quiz-container">
          {!show ? (
            <div className="quiz-card">
              {loading ? (
                <LoadingState />
              ) : questions.length === 0 ? (
                <EmptyQuizState categoryName={categoryName} onBack={handleBackToDashboard} />
              ) : (
                <>
                  <QuizTopBar
                    categoryName={categoryName}
                    questionSource={questionSource}
                    currentQuestion={currentQuestion}
                    questionsLength={questions.length}
                    progressPercent={progressPercent}
                    formattedTimer={formattedTimer}
                    timeLeft={timeLeft}
                  />

                  <QuizQuestionPanel
                    currentQ={currentQ}
                    currentQuestion={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    handleSelectOption={handleSelectOption}
                  />

                  <QuizActionsRow
                    currentQuestion={currentQuestion}
                    questionsLength={questions.length}
                    saveAndMove={saveAndMove}
                    handleSubmit={handleSubmit}
                    submitting={submitting}
                  />
                </>
              )}
            </div>
          ) : (
            <QuizResultCard
              result={result}
              handleRetake={handleRetake}
              handleBackToDashboard={handleBackToDashboard}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Quiz;

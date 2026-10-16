import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import QuizOption from "../../components/QuizOption";
import NavBar from "../../components/NavBar";
import "./Quiz.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Quiz() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load saved quiz state from localStorage so reload resumes smoothly
  const [questions, setQuestions] = useState(() => {
    const cached = localStorage.getItem(`quiz_questions_${categoryId}`);
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => {
    const cached = localStorage.getItem(`quiz_questions_${categoryId}`);
    return cached ? JSON.parse(cached).length === 0 : true;
  });

  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem(`quiz_current_${categoryId}`);
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [answers, setAnswers] = useState(() => {
    const cached = localStorage.getItem(`quiz_answers_${categoryId}`);
    return cached ? JSON.parse(cached) : [];
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem(`quiz_timer_${categoryId}`);
    return saved !== null ? parseInt(saved, 10) : 60;
  });

  const [categoryName, setCategoryName] = useState("");
  const [result, setResult] = useState({});
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mark quiz active in localStorage only if questions exist and quiz is ongoing
  useEffect(() => {
    if (!show && categoryId && questions.length > 0) {
      localStorage.setItem("active_quiz_id", categoryId);
    } else if (questions.length === 0 && !loading) {
      localStorage.removeItem("active_quiz_id");
    }
  }, [show, categoryId, questions.length, loading]);

  // Fetch category info for display
  useEffect(() => {
    if (!token || !categoryId) return;

    let isMounted = true;

    async function loadCategory() {
      try {
        const response = await fetch(`${API_URL}/api/users/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const found = (data.data || []).find((c) => c._id === categoryId);
        if (isMounted && found) {
          setCategoryName(found.name);
        }
      } catch (err) {
        console.error("Error loading category name:", err);
      }
    }

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [categoryId, token]);

  // Fetch questions: First try AI with a strict 2-second timeout, then fallback to MongoDB questions
  useEffect(() => {
    if (questions.length > 0 || !categoryId || !token) return;

    let isMounted = true;

    async function fetchQuestionsWithAiFallback() {
      let loadedQuestions = [];

      // 1. Attempt AI Generation with 2-second timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const promptText = `You are MCQHub AI, an expert MCQ generator. Generate exactly 10 multiple-choice questions for the category "${categoryName || "Knowledge"}". Return valid JSON only with structure { "mcqs": [ { "question": "...", "options": ["..."], "correctAnswer": "...", "difficultyLevel": "easy", "isActive": true } ] }`;

        const aiResponse = await fetch(`${API_URL}/api/ai/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: promptText,
            categoryId,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          if (Array.isArray(aiData.data) && aiData.data.length > 0) {
            loadedQuestions = aiData.data;
          } else if (Array.isArray(aiData.answer?.mcqs) && aiData.answer.mcqs.length > 0) {
            loadedQuestions = aiData.answer.mcqs.map((q, idx) => ({
              ...q,
              _id: q._id || `ai_q_${idx}`,
            }));
          }
        }
      } catch (err) {
        console.log("AI generation timed out (2s limit) or failed, falling back to MongoDB:", err.message);
      }

      // 2. Fallback to MongoDB questions if AI failed or timed out
      if (!loadedQuestions || loadedQuestions.length === 0) {
        try {
          const mongoRes = await fetch(`${API_URL}/api/users/categories/${categoryId}/questions`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const mongoData = await mongoRes.json();
          loadedQuestions = mongoData.data || [];
        } catch (mongoErr) {
          console.error("MongoDB questions fetch error:", mongoErr);
        }
      }

      // 3. Complete loading and update questions
      if (isMounted) {
        setLoading(false);
        setQuestions(loadedQuestions);

        if (loadedQuestions.length > 0) {
          localStorage.setItem(`quiz_questions_${categoryId}`, JSON.stringify(loadedQuestions));
          localStorage.setItem(`quiz_current_${categoryId}`, "0");
          localStorage.setItem(`quiz_answers_${categoryId}`, "[]");
          localStorage.setItem(`quiz_timer_${categoryId}`, "60");
          localStorage.setItem("active_quiz_id", categoryId);
          setCurrentQuestion(0);
          setAnswers([]);
          setTimeLeft(60);
          setShow(false);
          setResult({});
        } else {
          // If no questions exist in DB either, ensure active lock is removed
          localStorage.removeItem("active_quiz_id");
        }
      }
    }

    fetchQuestionsWithAiFallback();

    return () => {
      isMounted = false;
    };
  }, [categoryId, token, questions.length, categoryName]);

  // Current question object and selected answer
  const currentQ = questions[currentQuestion];
  const savedAnswerObj = answers.find((a) => a.questionId === currentQ?._id);
  const selectedAnswer = savedAnswerObj ? savedAnswerObj.selectedAnswer : "";

  // Handle selecting an option
  function handleSelectOption(option) {
    if (!currentQ) return;

    setAnswers((prevAnswers) => {
      const exists = prevAnswers.some((a) => a.questionId === currentQ._id);
      let updated;
      if (exists) {
        updated = prevAnswers.map((a) =>
          a.questionId === currentQ._id ? { ...a, selectedAnswer: option } : a
        );
      } else {
        updated = [...prevAnswers, { questionId: currentQ._id, selectedAnswer: option }];
      }
      localStorage.setItem(`quiz_answers_${categoryId}`, JSON.stringify(updated));
      return updated;
    });
  }

  // Clear quiz data from localStorage when finished
  const clearQuizData = useCallback(() => {
    localStorage.removeItem("active_quiz_id");
    localStorage.removeItem(`quiz_questions_${categoryId}`);
    localStorage.removeItem(`quiz_current_${categoryId}`);
    localStorage.removeItem(`quiz_answers_${categoryId}`);
    localStorage.removeItem(`quiz_timer_${categoryId}`);
    localStorage.removeItem("current");
    localStorage.removeItem("selectedAnswer");
  }, [categoryId]);

  // Submit Quiz to Backend
  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      // Ensure all questions have an entry
      const finalAnswers = questions.map((q) => {
        const found = answers.find((a) => a.questionId === q._id);
        return {
          questionId: q._id,
          selectedAnswer: found ? found.selectedAnswer || "" : "",
        };
      });

      const response = await fetch(`${API_URL}/api/users/quizzes/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId, answers: finalAnswers }),
      });

      const data = await response.json();

      clearQuizData();
      setResult(data);
      setShow(true);
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      console.error("Submit quiz error:", error);
      toast.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [categoryId, submitting, token, questions, answers, clearQuizData]);

  // Move function (Next or Back)
  const saveAndMove = useCallback(
    (step) => {
      if (step === "next" && !selectedAnswer) {
        toast.error("Please select an answer before continuing.");
        return;
      }

      const nextIndex = step === "next" ? currentQuestion + 1 : currentQuestion - 1;

      if (nextIndex >= 0 && nextIndex < questions.length) {
        setCurrentQuestion(nextIndex);
        localStorage.setItem(`quiz_current_${categoryId}`, String(nextIndex));

        // Reset timer for the next question to 60 seconds
        setTimeLeft(60);
        localStorage.setItem(`quiz_timer_${categoryId}`, "60");
      }
    },
    [categoryId, currentQuestion, questions.length, selectedAnswer]
  );

  // 60-Second Timer per question
  useEffect(() => {
    if (show || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {

          if (currentQuestion < questions.length - 1) {
            const nextIndex = currentQuestion + 1;
            setCurrentQuestion(nextIndex);
            localStorage.setItem(`quiz_current_${categoryId}`, String(nextIndex));
            localStorage.setItem(`quiz_timer_${categoryId}`, "60");
            return 60;
          } else {
            handleSubmit();
            return 0;
          }
        }
        const nextTime = prev - 1;
        localStorage.setItem(`quiz_timer_${categoryId}`, String(nextTime));
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, questions.length, currentQuestion, categoryId, handleSubmit]);

  function handleRetake() {
    clearQuizData();
    window.location.reload();
  }


  function handleBackToDashboard() {
    clearQuizData();
    navigate("/dashboard");
  }

  // Format timer MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progressPercent = questions.length > 0 ? Math.round(((currentQuestion + 1) / questions.length) * 100) : 0;

  return (
    <>
      {/* While quiz is actively playing with questions, hide Dashboard button. Show if completed or empty */}
      <NavBar showDashboardLink={show || (!loading && questions.length === 0)} />

      <div className="quiz-page">
        <div className="quiz-container">
          {!show ? (
            /* Active Quiz Interface or Loading / Empty state */
            <div className="quiz-card">
              {loading ? (
                /* 1. Loading State */
                <div className="quiz-loading-state">
                  <div className="spinner"></div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "8px", color: "var(--text-main)" }}>
                    Loading Quiz Questions...
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    Generating Quiz...
                  </p>
                </div>
              ) : questions.length === 0 ? (
                /* 2. No Questions in Category / DB */
                <div className="empty-state-card" style={{ padding: "40px 24px", textAlign: "center" }}>
                  <div className="empty-icon" style={{ marginBottom: "14px", color: "var(--accent)" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 8px", color: "var(--text-main)" }}>
                    No Questions Found
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", marginBottom: "24px", maxWidth: "420px" }}>
                    No questions are currently available for <strong>{categoryName || "this category"}</strong> 
                  </p>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={handleBackToDashboard}
                  >
                    ← Return to Dashboard
                  </button>
                </div>
              ) : (
                /* 3. Questions Available - Active Quiz */
                <>
                  {/* Top Progress & Timer Bar */}
                  <div className="quiz-top-bar">
                    <div className="quiz-category-chip">
                      <span className="category-dot"></span>
                      <span className="category-name-text">{categoryName || "Knowledge Quiz"}</span>
                    </div>

                    <div className="quiz-progress-section">
                      <span className="quiz-progress-label">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <div className="quiz-progress-bar-bg">
                        <div
                          className="quiz-progress-bar-fill"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className={`quiz-timer-badge ${timeLeft <= 10 ? "timer-warning" : ""}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="timer-text">{formattedTimer}</span>
                    </div>
                  </div>

                  {/* Question Content */}
                  {currentQ && (
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
                  )}

                  {/* Bottom Actions Row */}
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      <span>60s per question • Progress auto-saved</span>
                    </div>

                    {currentQuestion < questions.length - 1 ? (
                      <button
                        type="button"
                        className="button button-primary quiz-next-btn"
                        onClick={() => saveAndMove("next")}
                      >
                        Next Question →
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="button button-primary quiz-submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting..." : "Submit Quiz →"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Result / Score Screen */
            <div className="result-card">
              <div className="result-header">
                <div className="result-trophy-icon">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                    <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34" />
                    <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
                  </svg>
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

              {/* Score Highlight Box */}
              <div className="result-score-highlight">
                <div className="result-score-circle">
                  <span className="result-score-number">{result.score || 0}</span>
                  <span className="result-score-denominator">/ {result.totalQuestions || 10}</span>
                </div>
                <div className="result-accuracy-badge">
                  {result.percentage || 0}% Accuracy
                </div>
              </div>

              {/* Stats Summary Row (Flexbox Only) */}
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
                  <strong className="result-stat-val">
                    {(result.totalQuestions || 10) - (result.score || 0)}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="result-actions-row">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleRetake}
                >
                  ↻ Retake Quiz
                </button>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleBackToDashboard}
                >
                  Return to Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Quiz;

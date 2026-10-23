import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ROUTES } from "../../../constants/routes";
import {
  QUIZ_API_ENDPOINTS,
  QUIZ_CONFIG,
  QUIZ_MESSAGES,
  QUIZ_STORAGE_KEYS,
} from "../../../constants/quiz";
import { useFetch } from "../../../hooks/useFetch";

const API_URL = QUIZ_CONFIG.API_BASE_URL;

export function useQuizSession({ categoryId, token, navigate }) {
  const { execute: fetchData } = useFetch();

  const [questions, setQuestions] = useState(() => {
    const cached = localStorage.getItem(QUIZ_STORAGE_KEYS.questions(categoryId));
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => {
    const cached = localStorage.getItem(QUIZ_STORAGE_KEYS.questions(categoryId));
    return cached ? JSON.parse(cached).length === 0 : true;
  });

  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEYS.current(categoryId));
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [answers, setAnswers] = useState(() => {
    const cached = localStorage.getItem(QUIZ_STORAGE_KEYS.answers(categoryId));
    return cached ? JSON.parse(cached) : [];
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEYS.timer(categoryId));
    return saved !== null ? parseInt(saved, 10) : QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION;
  });

  const [categoryName, setCategoryName] = useState("");
  const [result, setResult] = useState({});
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [questionSource, setQuestionSource] = useState("");

  const currentQ = questions[currentQuestion];
  const savedAnswerObj = answers.find((answer) => answer.questionId === currentQ?._id);
  const selectedAnswer = savedAnswerObj ? savedAnswerObj.selectedAnswer : "";

  const clearQuizData = useCallback(() => {
    localStorage.removeItem(QUIZ_STORAGE_KEYS.ACTIVE_QUIZ_ID);
    localStorage.removeItem(QUIZ_STORAGE_KEYS.questions(categoryId));
    localStorage.removeItem(QUIZ_STORAGE_KEYS.current(categoryId));
    localStorage.removeItem(QUIZ_STORAGE_KEYS.answers(categoryId));
    localStorage.removeItem(QUIZ_STORAGE_KEYS.timer(categoryId));
    localStorage.removeItem(QUIZ_STORAGE_KEYS.CURRENT);
    localStorage.removeItem(QUIZ_STORAGE_KEYS.SELECTED_ANSWER);
  }, [categoryId]);

  const handleBackToDashboard = useCallback(() => {
    clearQuizData();
    navigate(ROUTES.DASHBOARD);
  }, [clearQuizData, navigate]);

  const handleRetake = useCallback(() => {
    clearQuizData();
    window.location.reload();
  }, [clearQuizData]);

  useEffect(() => {
    if (!show && categoryId && questions.length > 0) {
      localStorage.setItem(QUIZ_STORAGE_KEYS.ACTIVE_QUIZ_ID, categoryId);
    } else if (questions.length === 0 && !loading) {
      localStorage.removeItem(QUIZ_STORAGE_KEYS.ACTIVE_QUIZ_ID);
    }
  }, [show, categoryId, questions.length, loading]);

  useEffect(() => {
    if (!token || !categoryId) return;

    let isMounted = true;

    async function loadCategory() {
      try {
        const result = await fetchData({
          url: `${API_URL}${QUIZ_API_ENDPOINTS.CATEGORIES}`,
          headers: { Authorization: `Bearer ${token}` },
          throwOnError: false,
        });

        const found = (result.data?.data || []).find((entry) => entry._id === categoryId);
        if (isMounted && found) {
          setCategoryName(found.name);
        }
      } catch (error) {
        console.error("Error loading category name:", error);
      }
    }

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [categoryId, fetchData, token]);

  useEffect(() => {
    if (questions.length > 0 || !categoryId || !token) return;

    let isMounted = true;

    async function fetchQuestionsWithAiFallback() {
      let loadedQuestions = [];
      let source = "";

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), QUIZ_CONFIG.AI_TIMEOUT_MS);

        const promptText = `You are MCQHub AI, an expert MCQ generator. Generate exactly ${QUIZ_CONFIG.DEFAULT_QUESTION_COUNT} multiple-choice questions for the category "${categoryName || QUIZ_MESSAGES.DEFAULT_CATEGORY_NAME}". Return valid JSON only with structure { "mcqs": [ { "question": "...", "options": ["..."], "correctAnswer": "...", "difficultyLevel": "easy", "isActive": true } ] }`;

        const aiResult = await fetchData({
          url: `${API_URL}${QUIZ_API_ENDPOINTS.AI_GENERATE}`,
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
          throwOnError: false,
        });

        clearTimeout(timeoutId);

        if (aiResult.response.ok) {
          const aiData = aiResult.data;
          if (Array.isArray(aiData.data) && aiData.data.length > 0) {
            loadedQuestions = aiData.data;
            source = "ai";
          } else if (Array.isArray(aiData.answer?.mcqs) && aiData.answer.mcqs.length > 0) {
            loadedQuestions = aiData.answer.mcqs.map((question, index) => ({
              ...question,
              _id: question._id || `${QUIZ_CONFIG.DEFAULT_QUESTION_ID_PREFIX}${index}`,
            }));
            source = "ai";
          }
        }
      } catch (error) {
        console.log("AI generation timed out or failed, falling back to MongoDB:", error.message);
      }

      if (!loadedQuestions || loadedQuestions.length === 0) {
        try {
          const mongoResult = await fetchData({
            url: `${API_URL}${QUIZ_API_ENDPOINTS.CATEGORY_QUESTIONS(categoryId)}`,
            headers: { Authorization: `Bearer ${token}` },
            throwOnError: false,
          });
          loadedQuestions = mongoResult.data?.data || [];
          if (loadedQuestions.length > 0) {
            source = "db";
          }
        } catch (mongoError) {
          console.error("MongoDB questions fetch error:", mongoError);
        }
      }

      if (isMounted) {
        setLoading(false);
        setQuestions(loadedQuestions);
        setQuestionSource(source);

        if (loadedQuestions.length > 0) {
          if (source === "ai") {
            toast.success(QUIZ_MESSAGES.GENERATED_BY_AI);
          } else if (source === "db") {
            toast(QUIZ_MESSAGES.FETCHED_FROM_DB, { icon: "🗃️" });
          }

          localStorage.setItem(QUIZ_STORAGE_KEYS.questions(categoryId), JSON.stringify(loadedQuestions));
          localStorage.setItem(QUIZ_STORAGE_KEYS.current(categoryId), "0");
          localStorage.setItem(QUIZ_STORAGE_KEYS.answers(categoryId), "[]");
          localStorage.setItem(QUIZ_STORAGE_KEYS.timer(categoryId), String(QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION));
          localStorage.setItem(QUIZ_STORAGE_KEYS.ACTIVE_QUIZ_ID, categoryId);
          setCurrentQuestion(0);
          setAnswers([]);
          setTimeLeft(QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION);
          setShow(false);
          setResult({});
        } else {
          localStorage.removeItem(QUIZ_STORAGE_KEYS.ACTIVE_QUIZ_ID);
        }
      }
    }

    fetchQuestionsWithAiFallback();

    return () => {
      isMounted = false;
    };
  }, [categoryId, categoryName, fetchData, questions.length, token]);

  const handleSelectOption = useCallback(
    (option) => {
      if (!currentQ) return;

      setAnswers((prevAnswers) => {
        const exists = prevAnswers.some((answer) => answer.questionId === currentQ._id);

        const updated = exists
          ? prevAnswers.map((answer) =>
              answer.questionId === currentQ._id ? { ...answer, selectedAnswer: option } : answer
            )
          : [...prevAnswers, { questionId: currentQ._id, selectedAnswer: option }];

        localStorage.setItem(QUIZ_STORAGE_KEYS.answers(categoryId), JSON.stringify(updated));
        return updated;
      });
    },
    [categoryId, currentQ]
  );

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const finalAnswers = questions.map((question) => {
        const found = answers.find((answer) => answer.questionId === question._id);
        return {
          questionId: question._id,
          selectedAnswer: found ? found.selectedAnswer || "" : "",
        };
      });

      const result = await fetchData({
        url: `${API_URL}${QUIZ_API_ENDPOINTS.SUBMIT_QUIZ}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId, answers: finalAnswers }),
        throwOnError: false,
      });

      if (!result.response.ok) {
        throw new Error(result.data?.message || QUIZ_MESSAGES.SUBMIT_ERROR);
      }

      clearQuizData();
      setResult(result.data);
      setShow(true);
      toast.success(QUIZ_MESSAGES.SUBMIT_SUCCESS);
    } catch (error) {
      console.error("Submit quiz error:", error);
      toast.error(error.message || QUIZ_MESSAGES.SUBMIT_ERROR);
    } finally {
      setSubmitting(false);
    }
  }, [answers, categoryId, clearQuizData, fetchData, questions, submitting, token]);

  const saveAndMove = useCallback(
    (step) => {
      if (step === "next" && !selectedAnswer) {
        toast.error(QUIZ_MESSAGES.PLEASE_SELECT_ANSWER);
        return;
      }

      const nextIndex = step === "next" ? currentQuestion + 1 : currentQuestion - 1;

      if (nextIndex >= 0 && nextIndex < questions.length) {
        setCurrentQuestion(nextIndex);
        localStorage.setItem(QUIZ_STORAGE_KEYS.current(categoryId), String(nextIndex));
        setTimeLeft(QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION);
        localStorage.setItem(QUIZ_STORAGE_KEYS.timer(categoryId), String(QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION));
      }
    },
    [categoryId, currentQuestion, questions.length, selectedAnswer]
  );

  useEffect(() => {
    if (show || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentQuestion < questions.length - 1) {
            const nextIndex = currentQuestion + 1;
            setCurrentQuestion(nextIndex);
            localStorage.setItem(QUIZ_STORAGE_KEYS.current(categoryId), String(nextIndex));
            localStorage.setItem(QUIZ_STORAGE_KEYS.timer(categoryId), String(QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION));
            return QUIZ_CONFIG.DEFAULT_TIME_PER_QUESTION;
          }

          handleSubmit();
          return 0;
        }

        const nextTime = prev - 1;
        localStorage.setItem(QUIZ_STORAGE_KEYS.timer(categoryId), String(nextTime));
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [show, questions.length, currentQuestion, categoryId, handleSubmit]);

  const progressPercent = useMemo(
    () => (questions.length > 0 ? Math.round(((currentQuestion + 1) / questions.length) * 100) : 0),
    [currentQuestion, questions.length]
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTimer = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    questions,
    loading,
    currentQuestion,
    currentQ,
    selectedAnswer,
    timeLeft,
    categoryName,
    result,
    show,
    submitting,
    questionSource,
    progressPercent,
    formattedTimer,
    handleSelectOption,
    handleSubmit,
    saveAndMove,
    handleRetake,
    handleBackToDashboard,
    clearQuizData,
  };
}

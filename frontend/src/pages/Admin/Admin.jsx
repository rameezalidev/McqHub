import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import NavBar from "../../components/NavBar";
import { useFetch } from "../../hooks/useFetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Admin() {
  const [categories, setCategories] = useState([]);
  const [catName, setCatName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [message, setMessage] = useState("");

  // New Question Form State
  const [qTitle, setQTitle] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [opt4, setOpt4] = useState("");
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [difficulty, setDifficulty] = useState("easy");
  const [isSubmittingQ, setIsSubmittingQ] = useState(false);

  const token = localStorage.getItem("token");
  const { execute } = useFetch();

  useEffect(() => {
    if (!token) return;
    let isMounted = true;

    async function loadCategories() {
      try {
        const result = await execute({
          url: `${API_URL}/api/users/categories`,
          headers: { Authorization: `Bearer ${token}` },
          throwOnError: false,
        });

        if (isMounted) {
          setCategories(result.data?.data || []);
        }
      } catch (error) {
        console.error("Fetch categories error:", error);
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [execute, token]);

  const fetchCategoryQuestions = useCallback(async (catId) => {
    setLoadingQuestions(true);
    try {
      let result = await execute({
        url: `${API_URL}/api/admin/categories/${catId}/questions`,
        headers: { Authorization: `Bearer ${token}` },
        throwOnError: false,
      });

      if (!result.response.ok) {
        result = await execute({
          url: `${API_URL}/api/users/categories/${catId}/questions`,
          headers: { Authorization: `Bearer ${token}` },
          throwOnError: false,
        });
      }

      setQuestions(result.data?.data || []);
    } catch (err) {
      console.error("Fetch questions error:", err);
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  }, [execute, token]);

  // When a category is opened, fetch its questions
  function handleOpenCategory(cat) {
    setSelectedCategory(cat);
    setMessage("");
    fetchCategoryQuestions(cat._id);
  }

  // Back to category list
  function handleBackToCategories() {
    setSelectedCategory(null);
    setQuestions([]);
    setMessage("");
  }

  async function refreshCategories() {
    try {
      const result = await execute({
        url: `${API_URL}/api/users/categories`,
        headers: { Authorization: `Bearer ${token}` },
        throwOnError: false,
      });
      setCategories(result.data?.data || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const result = await execute({
        url: `${API_URL}/api/admin/categories`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: catName.trim() }),
        throwOnError: false,
      });

      if (result.response.ok) {
        setMessage(`Category "${catName}" added successfully!`);
        setCatName("");
        refreshCategories();
      } else {
        setMessage(result.data?.message || "Failed to add category");
      }
    } catch (err) {
      setMessage("Error adding category: " + err.message);
    }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const result = await execute({
        url: `${API_URL}/api/admin/categories/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        throwOnError: false,
      });

      if (result.response.ok) {
        setMessage("Category deleted successfully");
        refreshCategories();
        if (selectedCategory?._id === id) {
          setSelectedCategory(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddQuestion(e) {
    e.preventDefault();
    if (!selectedCategory) return;

    const options = [opt1.trim(), opt2.trim(), opt3.trim(), opt4.trim()];

    if (!qTitle.trim() || options.some((opt) => !opt)) {
      alert("Please fill in the question and all 4 options.");
      return;
    }

    const correctAnswer = options[correctOptionIdx];

    setIsSubmittingQ(true);
    setMessage("");

    try {
      const result = await execute({
        url: `${API_URL}/api/admin/categories/${selectedCategory._id}/questions`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: qTitle.trim(),
          options,
          correctAnswer,
          difficultyLevel: difficulty,
        }),
        throwOnError: false,
      });

      if (result.response.ok) {
        setMessage("Question added successfully!");
        setQTitle("");
        setOpt1("");
        setOpt2("");
        setOpt3("");
        setOpt4("");
        setCorrectOptionIdx(0);
        fetchCategoryQuestions(selectedCategory._id);
      } else {
        setMessage(result.data?.message || "Failed to add question");
      }
    } catch (err) {
      setMessage("Error adding question: " + err.message);
    } finally {
      setIsSubmittingQ(false);
    }
  }

  async function handleDeleteQuestion(questionId) {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const result = await execute({
        url: `${API_URL}/api/admin/categories/${selectedCategory._id}/questions/${questionId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        throwOnError: false,
      });

      if (result.response.ok) {
        setMessage("Question deleted successfully!");
        fetchCategoryQuestions(selectedCategory._id);
      } else {
        alert(result.data?.message || "Failed to delete question");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <NavBar />
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Admin Header */}
        <div
          className="card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 30px",
            backgroundColor: "#ffffff",
            borderRadius: "18px",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                padding: "4px 12px",
                borderRadius: "9999px",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary)",
                fontSize: "0.8rem",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              ADMIN PORTAL
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-main)" }}>
              {selectedCategory ? `Category: ${selectedCategory.name}` : "Categories & Quiz Management"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              {selectedCategory
                ? "Add or remove questions for this specific category."
                : "Select a category to manage its questions or create new categories."}
            </p>
          </div>

          {selectedCategory && (
            <button
              type="button"
              className="button button-secondary"
              onClick={handleBackToCategories}
            >
              ← Back to Categories
            </button>
          )}
        </div>

        {/* Global Alert Message */}
        {message && (
          <div
            style={{
              padding: "12px 18px",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "0.92rem",
            }}
          >
            {message}
          </div>
        )}

        {/* VIEW 1: Categories List & Add Category */}
        {!selectedCategory ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Add Category Form */}
            <div
              className="card"
              style={{
                padding: "28px 30px",
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-main)" }}>
                + Add New Category
              </h3>

              <form onSubmit={handleAddCategory} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="e.g. JavaScript, Python, Data Science..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  style={{
                    flex: "1 1 300px",
                    padding: "12px 16px",
                    border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.95rem",
                    outline: "none",
                  }}
                  required
                />
                <button type="submit" className="button button-primary">
                  Create Category →
                </button>
              </form>
            </div>

            {/* Existing Categories List */}
            <div
              className="card"
              style={{
                padding: "28px 30px",
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "18px", color: "var(--text-main)" }}>
                All Categories ({categories.length})
              </h3>

              {categories.length === 0 ? (
                <p style={{ color: "var(--text-muted)" }}>No categories yet. Create your first category above.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {categories.map((cat) => (
                    <div
                      key={cat._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 22px",
                        backgroundColor: "#fafbfc",
                        border: "1px solid var(--border-light)",
                        borderRadius: "12px",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                          {cat.name}
                        </h4>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ID: {cat._id}</span>
                      </div>

                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button
                          type="button"
                          className="button button-primary"
                          style={{ padding: "8px 16px", fontSize: "0.88rem" }}
                          onClick={() => handleOpenCategory(cat)}
                        >
                          Manage Questions →
                        </button>
                        <button
                          type="button"
                          className="button button-danger"
                          style={{ padding: "8px 14px", fontSize: "0.85rem" }}
                          onClick={() => handleDeleteCategory(cat._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEW 2: Questions in Specific Category (Add / Delete Questions) */
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Add Question Form */}
            <div
              className="card"
              style={{
                padding: "30px",
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
                + Add Question to {selectedCategory.name}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
                Enter the question text, 4 options, and select the correct answer.
              </p>

              <form onSubmit={handleAddQuestion} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Question Input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Question Statement</label>
                  <input
                    type="text"
                    placeholder="e.g. Which keyword declares a constant in JavaScript?"
                    value={qTitle}
                    onChange={(e) => setQTitle(e.target.value)}
                    style={{
                      padding: "12px 14px",
                      border: "1px solid var(--border-light)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "0.95rem",
                      outline: "none",
                    }}
                    required
                  />
                </div>

                {/* 4 Options (Flexbox layout) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Options & Correct Answer</label>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Option A", val: opt1, set: setOpt1, idx: 0 },
                      { label: "Option B", val: opt2, set: setOpt2, idx: 1 },
                      { label: "Option C", val: opt3, set: setOpt3, idx: 2 },
                      { label: "Option D", val: opt4, set: setOpt4, idx: 3 },
                    ].map((optItem) => (
                      <div
                        key={optItem.idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          backgroundColor: correctOptionIdx === optItem.idx ? "var(--primary-light)" : "#fafbfc",
                          border: `1.5px solid ${correctOptionIdx === optItem.idx ? "var(--primary)" : "var(--border-light)"}`,
                        }}
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          id={`radio-opt-${optItem.idx}`}
                          checked={correctOptionIdx === optItem.idx}
                          onChange={() => setCorrectOptionIdx(optItem.idx)}
                          style={{ cursor: "pointer", width: "18px", height: "18px" }}
                        />
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", width: "70px", color: "var(--text-main)" }}>
                          {optItem.label}:
                        </span>
                        <input
                          type="text"
                          placeholder={`Enter ${optItem.label}...`}
                          value={optItem.val}
                          onChange={(e) => optItem.set(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "8px 12px",
                            border: "1px solid var(--border-light)",
                            borderRadius: "8px",
                            outline: "none",
                            backgroundColor: "#ffffff",
                          }}
                          required
                        />
                        {correctOptionIdx === optItem.idx && (
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)" }}>
                            ✓ Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selector */}
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <label style={{ fontSize: "0.88rem", fontWeight: 600 }}>Difficulty:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="button button-primary"
                  style={{ alignSelf: "flex-start", marginTop: "8px" }}
                  disabled={isSubmittingQ}
                >
                  {isSubmittingQ ? "Saving Question..." : "+ Add Question"}
                </button>
              </form>
            </div>

            {/* Questions List for this Category */}
            <div
              className="card"
              style={{
                padding: "30px",
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
                  Questions in {selectedCategory.name} ({questions.length})
                </h3>
                <button
                  type="button"
                  className="button button-secondary"
                  style={{ padding: "6px 12px", fontSize: "0.82rem" }}
                  onClick={() => fetchCategoryQuestions(selectedCategory._id)}
                >
                  ↻ Refresh
                </button>
              </div>

              {loadingQuestions ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Loading questions...
                </div>
              ) : questions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  <p style={{ fontWeight: 600 }}>No questions found in this category.</p>
                  <p style={{ fontSize: "0.88rem" }}>Add a question above to build your quiz!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {questions.map((q, idx) => (
                    <div
                      key={q._id || idx}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        padding: "20px 24px",
                        backgroundColor: "#fafbfc",
                        border: "1px solid var(--border-light)",
                        borderRadius: "14px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "28px",
                              height: "28px",
                              borderRadius: "8px",
                              backgroundColor: "var(--primary)",
                              color: "#ffffff",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <div>
                            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 6px" }}>
                              {q.question}
                            </h4>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                backgroundColor:
                                  q.difficultyLevel === "hard"
                                    ? "#fff1f2"
                                    : q.difficultyLevel === "medium"
                                    ? "#fef3c7"
                                    : "#f0fdf4",
                                color:
                                  q.difficultyLevel === "hard"
                                    ? "#e11d48"
                                    : q.difficultyLevel === "medium"
                                    ? "#d97706"
                                    : "#16a34a",
                              }}
                            >
                              {q.difficultyLevel || "easy"}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="button button-danger"
                          style={{ padding: "6px 12px", fontSize: "0.82rem", flexShrink: 0 }}
                          onClick={() => handleDeleteQuestion(q._id)}
                        >
                          Delete
                        </button>
                      </div>

                      {/* Options List */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                        {(q.options || []).map((opt, oIdx) => {
                          const isCorrect = q.correctAnswer && opt === q.correctAnswer;
                          return (
                            <div
                              key={oIdx}
                              style={{
                                flex: "1 1 calc(50% - 8px)",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                fontSize: "0.88rem",
                                backgroundColor: isCorrect ? "#ecfdf5" : "#ffffff",
                                border: `1px solid ${isCorrect ? "#10b981" : "var(--border-light)"}`,
                                color: isCorrect ? "#065f46" : "var(--text-body)",
                                fontWeight: isCorrect ? 700 : 500,
                              }}
                            >
                              {["A", "B", "C", "D"][oIdx]}: {opt} {isCorrect && "✓"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Admin;
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface MCQ {
  mcq: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correct: keyof MCQ["options"];
}

function quizToGoogleFormText(questions: MCQ[]) {
  return questions
    .map(
      (q, i) =>
        `Q${i + 1}: ${q.mcq}\nA. ${q.options.a}\nB. ${q.options.b}\nC. ${q.options.c}\nD. ${q.options.d}\nCorrect: ${q.correct.toUpperCase()}\n`
    )
    .join("\n");
}

export default function QuizMain() {
  const [textContent, setTextContent] = useState<string>("");
  const [quizLevel, setQuizLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError(null);
    setShowResults(false);
    setQuestions([]);
    setSelectedOptions([]);
    setScore(0);

    try {
      const res = await fetch("/api/groq-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text_content: textContent,
          quiz_level: quizLevel,
          question_count: questionCount,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate quiz");
      const data = await res.json();
      setQuestions(data.mcqs);
      setSelectedOptions(Array(data.mcqs.length).fill(null));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIdx: number, value: string) => {
    setSelectedOptions((prev) => {
      const updated = [...prev];
      updated[qIdx] = value;
      return updated;
    });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((q, i) => {
      const correctAnswer = q.options[q.correct];
      if (selectedOptions[i] === correctAnswer) newScore += 1;
    });
    setScore(newScore);
    setShowResults(true);
  };

  return (
    <motion.div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-blue-800 rounded-xl shadow-md p-6 mb-8">
        <label className="block mb-2 font-bold text-white text-xl">📄 Paste content for quiz:</label>
        <textarea
          className="w-full border border-blue-400 rounded-lg p-4 min-h-32 text-lg bg-blue-900 text-white placeholder-blue-300"
          rows={6}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste your course content, articles, or any text to generate questions..."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-4">
          <div>
            <label className="block mb-2 font-bold text-white text-lg">🎯 Choose difficulty:</label>
            <select
              className="w-full border border-blue-400 rounded-lg p-3 text-lg bg-blue-900 text-white"
              value={quizLevel}
              onChange={(e) => setQuizLevel(e.target.value as "easy" | "medium" | "hard")}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-bold text-white text-lg">🔢 Number of questions:</label>
            <select
              className="w-full border border-blue-400 rounded-lg p-3 text-lg bg-blue-900 text-white"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              {[3, 5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="w-full bg-white text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-blue-200 disabled:opacity-50 transition-colors flex items-center justify-center text-xl"
              onClick={handleGenerateQuiz}
              disabled={loading || !textContent}
            >
              {loading ? "Generating..." : "🚀 Generate Quiz"}
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mt-4 rounded text-red-800 font-bold text-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {questions.length > 0 && (
        <motion.div className="bg-blue-900 rounded-xl shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">📝 Your Quiz:</h2>
            {!showResults && (
              <div className="text-lg text-blue-200">
                Answer all questions before submitting
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="space-y-8">
              {questions.map((q, idx) => {
                const opts = Object.values(q.options);
                return (
                  <motion.div
                    key={idx}
                    className={`p-6 rounded-lg border-2 ${
                      showResults && selectedOptions[idx] === q.options[q.correct]
                        ? "bg-blue-700 border-green-400"
                        : showResults
                        ? "bg-blue-700 border-red-400"
                        : "bg-blue-800 border-blue-700"
                    }`}
                  >
                    <div className="font-bold mb-4 text-2xl text-white">{`Q${idx + 1}. ${q.mcq}`}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {opts.map((opt, oidx) => (
                        <label
                          key={oidx}
                          className={`flex items-center p-3 rounded-lg cursor-pointer text-xl font-semibold
                            ${
                              selectedOptions[idx] === opt
                                ? "bg-blue-400 text-white"
                                : "bg-blue-600 text-blue-100"
                            }
                            ${showResults && opt === q.options[q.correct] ? "ring-2 ring-green-400" : ""}
                          `}
                        >
                          <input
                            type="radio"
                            name={`q${idx}`}
                            value={opt}
                            checked={selectedOptions[idx] === opt}
                            onChange={() => handleOptionChange(idx, opt)}
                            disabled={showResults}
                            className="mr-3 accent-blue-900 w-6 h-6"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    {showResults && (
                      <div className="mt-4 text-lg bg-blue-800 p-3 rounded border border-blue-400 text-white">
                        <span>
                          Correct answer:{" "}
                          <span className="font-bold text-green-300">
                            {q.options[q.correct]}
                          </span>
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            {!showResults && (
              <div className="mt-10 flex justify-center">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition-colors font-bold text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedOptions.some((opt) => opt === null)}
                >
                  ✅ Submit Answers
                </button>
              </div>
            )}
          </form>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 bg-blue-700 text-white p-8 rounded-lg shadow-lg text-center"
            >
              <div className="text-4xl font-extrabold mb-4">
                🎉 You scored {score} / {questions.length}
              </div>
              <div className="text-2xl opacity-90 mb-4">
                {score === questions.length
                  ? "Perfect! Amazing job!"
                  : score > questions.length / 2
                  ? "Good work! Keep practicing!"
                  : "Keep studying! You'll improve next time!"}
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setSelectedOptions(Array(questions.length).fill(null));
                    setScore(0);
                  }}
                  className="bg-white text-blue-800 px-6 py-3 rounded-lg font-bold hover:bg-blue-200 transition-colors text-xl"
                >
                  Try Again
                </button>
                <button
                  onClick={() => {
                    const text = quizToGoogleFormText(questions);
                    navigator.clipboard.writeText(text);
                    window.open("https://forms.new", "_blank");
                  }}
                  className="bg-green-400 text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-green-500 transition-colors text-xl"
                  title="Copy quiz to clipboard and open Google Forms"
                >
                  Export Quiz to Google Form
                </button>
              </div>
              <div className="mt-2 text-lg text-green-200">
                (Quiz copied! Paste into your new Google Form.)
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
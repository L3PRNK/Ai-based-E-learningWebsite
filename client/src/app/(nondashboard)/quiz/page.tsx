"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';

interface QuizQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

export default function QuizGenerator() {
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount: Number(questionCount),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }
      
      const data = await response.json();
      setQuiz(data.quiz);
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Head>
        <title>Quiz Generator | E-Learning Platform</title>
      </Head>
      
      <main className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">AI Quiz Generator</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic or Learning Material
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTopic(e.target.value)}
                placeholder="Enter a topic or paste content to generate quiz questions from"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="questionCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="questionCount"
                  value={questionCount}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestionCount(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isGenerating}
                className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                  isGenerating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition duration-200`}
              >
                {isGenerating ? 'Generating Quiz...' : 'Generate Quiz'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {quiz && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Generated Quiz</h2>
              
              <div className="space-y-6">
                {quiz.questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium mb-3">Question {index + 1}: {question.text}</p>
                    
                    <div className="space-y-2 ml-4">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-start">
                          <input
                            type="radio"
                            id={`q${index}-opt${optIndex}`}
                            name={`question-${index}`}
                            className="mt-1 mr-2"
                            disabled
                          />
                          <label htmlFor={`q${index}-opt${optIndex}`} className="text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <details className="text-sm">
                        <summary className="text-blue-600 cursor-pointer font-medium">
                          Show Answer
                        </summary>
                        <p className="mt-2 text-green-700">
                          Correct Answer: {question.options[question.correctIndex]}
                        </p>
                        {question.explanation && (
                          <p className="mt-1 text-gray-600">{question.explanation}</p>
                        )}
                      </details>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => window.print()}
                >
                  Print Quiz
                </button>
                <button
                  type="button"
                  className="py-2 px-4 bg-green-600 rounded-md text-white hover:bg-green-700"
                  onClick={() => {
                    // Here you'd implement saving to your database
                    alert('Quiz saved to your library!');
                  }}
                >
                  Save to Library
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
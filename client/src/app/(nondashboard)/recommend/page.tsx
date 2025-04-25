"use client";

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useGetCoursesQuery } from "@/state/api";
import CourseCardSearch from "@/components/CourseCardSearch";
import Loading from "@/components/Loading";
import { motion } from "framer-motion";

// ✅ Ensure WebGL backend is only registered once
if (!tf.engine().backendNames().includes("webgl")) {
  tf.setBackend("webgl");
}

// ✅ Create TensorFlow.js Model (Binary Classification)
const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [5], units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 4, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" })); // ✅ Sigmoid for probability output

  model.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] }); // ✅ Correct loss function
  return model;
};

// ✅ Train the model
const trainModel = async (model: tf.Sequential) => {
  const trainingData = [
    [3 / 5, 5 / 5, 1, 14000 / 20000, 500 / 1000], 
    [2 / 5, 4 / 5, 0, 12000 / 20000, 300 / 1000], 
    [4 / 5, 5 / 5, 1, 16000 / 20000, 800 / 1000]
  ];
  const labels = [1, 0, 1]; // ✅ Binary classification (0 or 1)

  const xs = tf.tensor2d(trainingData);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 50 });

  xs.dispose();
  ys.dispose();
};

// ✅ Predict recommendations
const predictRecommendations = async (model: tf.Sequential, input: number[]) => {
  const tensorInput = tf.tensor2d([input]);
  const prediction = model.predict(tensorInput) as tf.Tensor;
  const result = await prediction.data();

  tensorInput.dispose(); // Free memory
  prediction.dispose(); // Free memory
  return result;
};

// ✅ Main Component
const Recommendation = () => {
  const { data: courses, isLoading, isError } = useGetCoursesQuery({});
  const modelRef = useRef<tf.Sequential | null>(null);
  const [recommendations, setRecommendations] = useState<{ courseId: string; score: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Initialize Model
  useEffect(() => {
    const loadModel = async () => {
      if (!modelRef.current) {
        modelRef.current = createModel();
        await trainModel(modelRef.current);
      }
    };

    loadModel();
  }, []);

  // ✅ Handle AI Recommendation
  const handleRecommendation = async () => {
    if (!modelRef.current || !courses) return;

    setLoading(true);
    
    const rankedCourses = await Promise.all(
      courses.map(async (course) => {
        // Normalize features
        const inputFeatures = [
          (course.level === "Beginner" ? 1 : 3) / 5,
          4 / 5, // Dummy rating
          1, // Dummy category encoding
          (course.price ?? 10000) / 20000, 
          500 / 1000
        ];

        const score = await predictRecommendations(modelRef.current!, inputFeatures);
        return { courseId: course.courseId, score: score[0] };
      })
    );

    const sortedCourses = rankedCourses.sort((a, b) => b.score - a.score);
    setRecommendations(sortedCourses);
    setLoading(false);
  };

  if (isLoading) return <Loading />;
  if (isError || !courses) return <div className="text-red-500 text-center">Failed to fetch courses</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center text-indigo-800 mb-8"
      >
        AI-Powered Course Recommendations
      </motion.h1>

      <div className="flex justify-center">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
          onClick={handleRecommendation}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Get AI Recommendations"}
        </motion.button>
      </div>

      {loading && (
        <div className="text-center mt-4 text-gray-600">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            🤖 AI is analyzing your preferences...
          </motion.p>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        {recommendations.length > 0 ? (
          recommendations.map(({ courseId, score }, index) => {
            const course = courses.find((c) => c.courseId === courseId);
            return course ? (
              <motion.div 
                key={course.courseId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute top-3 right-3 z-10 bg-white px-2 py-1 rounded-full shadow-md border border-gray-200">
                  <span className="text-sm font-medium">Match: </span>
                  <span className={`font-bold ${score > 0.8 ? "text-green-600" : score > 0.5 ? "text-yellow-600" : "text-red-600"}`}>
                    {(score * 100).toFixed(0)}%
                  </span>
                </div>

                {index === 0 && (
                  <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-full shadow-md text-xs font-bold">
                    Best Match
                  </div>
                )}

                <CourseCardSearch course={course} />
              </motion.div>
            ) : null;
          })
        ) : (
          <p className="text-center text-gray-500 mt-6">No recommendations yet. Click the button above to get suggestions.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Recommendation;

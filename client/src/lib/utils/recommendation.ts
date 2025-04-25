import * as tf from "@tensorflow/tfjs";

// Define the model
export const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [5], units: 16, activation: "relu" }));
  model.add(tf.layers.dense({ units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  model.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] });
  return model;
};

// Train the model
export const trainModel = async (model: tf.Sequential, trainingData: number[][], labels: number[]) => {
  const xs = tf.tensor2d(trainingData);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 50 });
};

// Predict recommendations (Fix: await `data()`)
export const predictRecommendations = async (model: tf.Sequential, input: number[]) => {
  const tensorInput = tf.tensor2d([input]);
  const prediction = model.predict(tensorInput) as tf.Tensor;
  return await prediction.data();  // ✅ Fix: Await data()
};

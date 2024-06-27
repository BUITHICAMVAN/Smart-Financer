const tf = require('@tensorflow/tfjs');

const maxTimeSteps = 12; // Maximum number of time steps to use as input features
const features = 1;      // Number of features (e.g., amount)

// Define your min and max values for denormalization
const min = 0; // Replace with your actual minimum value
const max = 1000; // Replace with your actual maximum value

const createModel = (timeSteps) => {
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [timeSteps, features] }));
  model.add(tf.layers.lstm({ units: 50 }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  console.log('Model created with timeSteps:', timeSteps); // Debugging statement
  return model;
};

const trainModel = async (model, xTrain, yTrain) => {
  console.log('Training model...'); // Debugging statement
  await model.fit(xTrain, yTrain, { epochs: 50, batchSize: 32 });
  console.log('Model trained.'); // Debugging statement
};

const prepareData = (data, amountField) => {
  console.log('Data:', data); // Debugging statement

  const amounts = data.map(d => {
    const amount = Number(d.dataValues[amountField]);
    if (isNaN(amount)) {
      console.error('Invalid amount detected:', d.dataValues); // Debugging statement
    }
    return amount;
  });
  console.log('Amounts:', amounts); // Debugging statement

  const timeSteps = Math.min(amounts.length, maxTimeSteps);
  const xTrain = [];
  const yTrain = [];

  for (let i = timeSteps; i < amounts.length; i++) {
    xTrain.push(amounts.slice(i - timeSteps, i));
    yTrain.push(amounts[i]);
  }

  console.log('xTrain:', xTrain); // Debugging statement
  console.log('yTrain:', yTrain); // Debugging statement

  if (xTrain.length === 0 || yTrain.length === 0) {
    console.error('xTrain or yTrain is empty'); // Debugging statement
  }

  const xTrainTensor = tf.tensor3d(xTrain.map(arr => arr.map(value => [value])), [xTrain.length, timeSteps, features]);
  const yTrainTensor = tf.tensor2d(yTrain, [yTrain.length, 1]);

  const latestInput = tf.tensor3d([amounts.slice(amounts.length - timeSteps).map(value => [value])], [1, timeSteps, features]);

  return { xTrain: xTrainTensor, yTrain: yTrainTensor, latestInput, timeSteps };
};

const denormalizeValue = (value, min, max) => {
  return value * (max - min) + min;
};

const forecastNext = (model, latestInput) => {
  const prediction = model.predict(latestInput);
  const normalizedPrediction = prediction.dataSync()[0];
  const actualPrediction = denormalizeValue(normalizedPrediction, min, max);
  console.log('Prediction:', normalizedPrediction, 'Actual Prediction:', actualPrediction); // Debugging statement
  return actualPrediction;
};

module.exports = { createModel, trainModel, prepareData, forecastNext };

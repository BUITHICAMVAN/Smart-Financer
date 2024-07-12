const tf = require('@tensorflow/tfjs');
const seedrandom = require('seedrandom');

// Set a random seed for reproducibility
const seed = 42;
seedrandom(seed, { global: true });

const maxTimeSteps = 4; // Maximum number of time steps to use as input features
const features = 1;      // Number of features (e.g., amount)

// Normalize value to a range of [0, 1]
const normalizeValue = (value, min, max) => {
  return (value - min) / (max - min);
};

// Denormalize value from the range of [0, 1] back to the original scale
const denormalizeValue = (value, min, max) => {
  return value * (max - min) + min;
};

// Function to create the LSTM model
const createModel = (timeSteps) => {
  const model = tf.sequential(); // create sequential model

  // add first LSTM layer with 60 units and return sequences
  model.add(tf.layers.lstm({
    units: 60,
    activation: 'relu',
    returnSequences: true, // return sequences to feed the next layer
    inputShape: [timeSteps, features],
    kernelInitializer: tf.initializers.glorotUniform({ seed })
  }));

  // add another layer
  model.add(tf.layers.lstm({
    units: 30,
    activation: 'relu',
    kernelInitializer: tf.initializers.glorotUniform({ seed })
  }));

  // add a dense layer with a single input
  model.add(tf.layers.dense({
    units: 1,
    kernelInitializer: tf.initializers.glorotUniform({ seed })
  }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  console.log('Model created with timeSteps:', timeSteps); // Debugging statement
  return model;
};

// Custom logging callback
class LoggingCallback extends tf.Callback {
  onEpochEnd(epoch, logs) {
    console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}, val_loss = ${logs.val_loss}`);
  }
  onTrainEnd(logs) {
    console.log('Training completed.');
  }
}

// Function to train the model with early stopping and logging
const trainModel = async (model, xTrain, yTrain) => {
  console.log('Training model...');

  const earlyStoppingCallback = tf.callbacks.earlyStopping({
    monitor: 'val_loss',
    patience: 10
  });

  const loggingCallback = new LoggingCallback();

  // Check the shapes of xTrain and yTrain
  console.log('xTrain shape:', xTrain.shape);
  console.log('yTrain shape:', yTrain.shape);

  const validationSplit = xTrain.shape[0] > 1 ? 0.2 : 0; // Use validation split only if there's enough data

  // fit model with training data
  await model.fit(xTrain, yTrain, {
    epochs: 50,
    batchSize: 32,
    validationSplit: validationSplit,
    callbacks: validationSplit > 0 ? [earlyStoppingCallback, loggingCallback] : [loggingCallback],
  });
  console.log('Model trained.');
};

// Function to prepare the data for training
const prepareData = (data, amountField, min, max) => {
  console.log('Data:', data); // Debugging statement

  const amounts = data.map(d => {
    const amount = Number(d[amountField]);
    if (isNaN(amount)) {
      console.error('Invalid amount detected:', d);
    }
    return normalizeValue(amount, min, max);
  });

  console.log('Amounts:', amounts); // Debugging statement

  const timeSteps = Math.min(amounts.length, maxTimeSteps);
  if (timeSteps < 1) {
    console.error('Not enough data points to create time steps');
    return { xTrain: [], yTrain: [], latestInput: null, timeSteps: 0 };
  }

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
    return { xTrain: [], yTrain: [], latestInput: null, timeSteps: 0 };
  }

  const xTrainTensor = tf.tensor3d(xTrain.map(arr => arr.map(value => [value])), [xTrain.length, timeSteps, features]);
  const yTrainTensor = tf.tensor2d(yTrain, [yTrain.length, 1]);

  const latestInput = tf.tensor3d([amounts.slice(amounts.length - timeSteps).map(value => [value])], [1, timeSteps, features]);

  // Log tensor shapes
  console.log('xTrainTensor shape:', xTrainTensor.shape);
  console.log('yTrainTensor shape:', yTrainTensor.shape);

  return { xTrain: xTrainTensor, yTrain: yTrainTensor, latestInput, timeSteps };
};

// Function to forecast the next value
const forecastNext = (model, latestInput, min, max) => {
  const prediction = model.predict(latestInput);
  const normalizedPrediction = prediction.dataSync()[0];
  const actualPrediction = denormalizeValue(normalizedPrediction, min, max);
  console.log('Prediction:', normalizedPrediction, 'Actual Prediction:', actualPrediction); // Debugging statement
  return actualPrediction;
};

// Function to forecast using Linear Regression as a fallback
const forecastWithLinearRegression = (data) => {
  if (data.length < 2) {
    return 'Not enough data'; // Linear regression requires at least two data points
  }

  const x = data.map((_, index) => index);
  const y = data;

  const xMean = tf.mean(x).arraySync();
  const yMean = tf.mean(y).arraySync();

  const numerator = tf.sum(tf.mul(tf.sub(x, xMean), tf.sub(y, yMean))).arraySync();
  const denominator = tf.sum(tf.square(tf.sub(x, xMean))).arraySync();

  const slope = numerator / denominator;
  const intercept = yMean - (slope * xMean);

  const nextValue = intercept + slope * x.length;
  return nextValue;
};

const calculateMAE = (actual, predicted) => { // function to calculate Absolute Error (MAE)
  const n = actual.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += Math.abs(actual[i] - predicted[i]);
  }
  return sum / n;
};

module.exports = { createModel, trainModel, prepareData, forecastNext, calculateMAE, forecastWithLinearRegression };

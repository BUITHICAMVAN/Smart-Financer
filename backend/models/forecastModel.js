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

// Function to train the model
const trainModel = async (model, xTrain, yTrain) => {
  console.log('Training model...');

  // fit model with training data
  await model.fit(xTrain, yTrain, {
    epochs: 50,
    batchSize: 32,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
      }
    }
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

module.exports = { createModel, trainModel, prepareData, forecastNext };

const Expense = require('../models/expense/expenseModel');
const Income = require('../models/income/incomeModel');
const Saving = require('../models/saving/savingModel');
const { createModel, trainModel, prepareData, forecastNext, forecastWithLinearRegression } = require('../models/forecastModel');
const moment = require('moment');
const connectRedis = require('../redis/redisClient');
const csv = require('csv-parser');
const fs = require('fs');

// Function to fetch data for the user
const fetchData = async (userId) => {
  const incomes = await Income.findAll({
    where: { income_user_id: userId },
    order: [['income_created_at', 'ASC']]
  });

  const expenses = await Expense.findAll({
    where: { expense_user_id: userId },
    order: [['expense_created_at', 'ASC']]
  });

  const savings = await Saving.findAll({
    where: { saving_user_id: userId },
    order: [['saving_created_at', 'ASC']]
  });

  return { incomes, expenses, savings };
};

// Function to fetch data and calculate min and max values
const fetchDataAndCalculateMinMax = async () => {
  const incomes = await Income.findAll();
  const expenses = await Expense.findAll();
  const savings = await Saving.findAll();

  const amounts = [
    ...incomes.map(income => Number(income.dataValues.income_amount)),
    ...expenses.map(expense => Number(expense.dataValues.expense_amount)),
    ...savings.map(saving => Number(saving.dataValues.saving_amount))
  ];

  const validAmounts = amounts.filter(amount => !isNaN(amount));

  const min = Math.min(...validAmounts);
  const max = Math.max(...validAmounts);

  return { min, max };
};

// Function to aggregate data by type and month
const aggregateDataByTypeAndMonth = (data, typeField, amountField, dateField) => {
  const aggregatedData = {};

  data.forEach(item => {
    const typeId = item[typeField];
    const monthYear = moment(item[dateField]).format('YYYY-MM');
    const amount = Number(item[amountField]);

    const key = `${typeId}_${monthYear}`;

    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        typeId,
        monthYear,
        totalAmount: 0
      };
    }

    aggregatedData[key].totalAmount += amount;
  });

  return Object.values(aggregatedData);
};

// Helper function to read and parse CSV data
const readCSVData = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Function to aggregate CSV data
const aggregateCSVData = (data) => {
  const aggregatedData = {
    incomes: [],
    expenses: [],
    savings: []
  };

  const tempData = {};

  data.forEach((row) => {
    const date = new Date(row['Date']);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const category = row['Category'];
    const transactionCategory = row['Transaction_Category'];
    const transactionType = row['Transaction_Type'];
    const amount = parseFloat(row['Amount']);
    let typeId;

    if (transactionType === 'Income') {
      typeId = `income_${category}`;
    } else if (transactionType === 'Savings') {
      typeId = `savings_${category}`;
    } else {
      typeId = `expenses_${transactionCategory}`;
    }

    const key = `${typeId}_${monthYear}`;

    if (!tempData[key]) {
      tempData[key] = { typeId, monthYear, totalAmount: 0 };
    }

    tempData[key].totalAmount += amount;
  });

  Object.values(tempData).forEach(item => {
    const { typeId, monthYear, totalAmount } = item;

    if (typeId.startsWith('income_')) {
      aggregatedData.incomes.push({ typeId, monthYear, totalAmount });
    } else if (typeId.startsWith('expenses_')) {
      aggregatedData.expenses.push({ typeId, monthYear, totalAmount });
    } else if (typeId.startsWith('savings_')) {
      aggregatedData.savings.push({ typeId, monthYear, totalAmount });
    }
  });

  return aggregatedData;
};

// Main function to forecast the next month
const forecastNextMonth = async (req, res) => {
  let client;
  try {
    const userId = req.user.user_id;
    if (!userId) throw new Error('User ID is missing');

    client = await connectRedis();
    const cacheKey = `forecast_${userId}`;
    const cachedData = await client.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));

    const { min, max } = await fetchDataAndCalculateMinMax();
    let incomes, expenses, savings;
    let types;

    if (req.query.dataSource === 'csv') {
      const csvData = await readCSVData('./csv/updated_dataset_v3.csv');
      const aggregatedCSVData = aggregateCSVData(csvData);
      incomes = aggregatedCSVData.incomes;
      expenses = aggregatedCSVData.expenses;
      savings = aggregatedCSVData.savings;

      types = {
        incomes: { data: incomes, typeField: 'typeId', amountField: 'totalAmount', dateField: 'monthYear' },
        expenses: { data: expenses, typeField: 'typeId', amountField: 'totalAmount', dateField: 'monthYear' },
        savings: { data: savings, typeField: 'typeId', amountField: 'totalAmount', dateField: 'monthYear' }
      };
    } else {
      ({ incomes, expenses, savings } = await fetchData(userId));

      types = {
        incomes: { data: incomes, typeField: 'income_type_id', amountField: 'income_amount', dateField: 'income_created_at' },
        expenses: { data: expenses, typeField: 'expense_type_id', amountField: 'expense_amount', dateField: 'expense_created_at' },
        savings: { data: savings, typeField: 'saving_type_id', amountField: 'saving_amount', dateField: 'saving_created_at' }
      };
    }

    const predictions = {};
    for (const [dataType, { data, typeField, amountField, dateField }] of Object.entries(types)) {
      const aggregatedData = aggregateDataByTypeAndMonth(data, typeField, amountField, dateField);
      const typeIds = [...new Set(aggregatedData.map(item => item.typeId))];

      for (const typeId of typeIds) {
        const filteredData = aggregatedData.filter(item => item.typeId === typeId);
        const { xTrain, yTrain, latestInput, timeSteps } = prepareData(filteredData, 'totalAmount', min, max);

        if (xTrain.length === 0 || yTrain.length === 0) {
          // Use linear regression as fallback if not enough data for LSTM
          const fallbackPrediction = forecastWithLinearRegression(filteredData.map(item => item.totalAmount));
          predictions[`${dataType}_${typeId}`] = fallbackPrediction;
          console.log(`Fallback prediction for ${dataType}_${typeId}:`, fallbackPrediction); // Debugging statement
          continue;
        }

        const model = createModel(timeSteps);
        await trainModel(model, xTrain, yTrain);
        const nextMonthPrediction = forecastNext(model, latestInput, min, max);
        predictions[`${dataType}_${typeId}`] = nextMonthPrediction;
      }
    }

    await client.set(cacheKey, JSON.stringify({ predictions }));
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forecastNextMonth };

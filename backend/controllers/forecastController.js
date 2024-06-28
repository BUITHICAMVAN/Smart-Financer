const Expense = require('../models/expense/expenseModel');
const Income = require('../models/income/incomeModel');
const Saving = require('../models/saving/savingModel');
const { createModel, trainModel, prepareData, forecastNext } = require('../models/forecastModel');
const moment = require('moment');

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

  console.log('Fetched Data:', { incomes, expenses, savings }); // Debugging statement

  return { incomes, expenses, savings };
};

const fetchDataAndCalculateMinMax = async () => {
  const incomes = await Income.findAll();
  const expenses = await Expense.findAll();
  const savings = await Saving.findAll();

  // Combine all amounts into a single array
  const amounts = [
    ...incomes.map(income => Number(income.dataValues.income_amount)),
    ...expenses.map(expense => Number(expense.dataValues.expense_amount)),
    ...savings.map(saving => Number(saving.dataValues.saving_amount))
  ];

  // Filter out invalid data points
  const validAmounts = amounts.filter(amount => !isNaN(amount));

  // Calculate the minimum and maximum values
  const min = Math.min(...validAmounts);
  const max = Math.max(...validAmounts);

  return { min, max };
};

const aggregateDataByTypeAndMonth = (data, typeField, amountField, dateField) => {
  const aggregatedData = {};

  data.forEach(item => {
    const typeId = item.dataValues[typeField];
    const month = moment(item.dataValues[dateField]).format('YYYY-MM');
    const amount = Number(item.dataValues[amountField]);

    const key = `${typeId}_${month}`;

    if (!aggregatedData[key]) {
      aggregatedData[key] = {
        typeId,
        month,
        totalAmount: 0
      };
    }

    aggregatedData[key].totalAmount += amount;
  });

  return Object.values(aggregatedData);
};

const forecastNextMonth = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      throw new Error('User ID is missing');
    }

    const { min, max } = await fetchDataAndCalculateMinMax();

    const { incomes, expenses, savings } = await fetchData(userId);

    const types = {
      incomes: { data: incomes, typeField: 'income_type_id', amountField: 'income_amount', dateField: 'income_created_at' },
      expenses: { data: expenses, typeField: 'expense_type_id', amountField: 'expense_amount', dateField: 'expense_created_at' },
      savings: { data: savings, typeField: 'saving_type_id', amountField: 'saving_amount', dateField: 'saving_created_at' }
    };

    const predictions = {};

    for (const [dataType, { data, typeField, amountField, dateField }] of Object.entries(types)) {
      const aggregatedData = aggregateDataByTypeAndMonth(data, typeField, amountField, dateField);
      console.log(`Aggregated Data for ${dataType}:`, aggregatedData); // Debugging statement

      const typeIds = [...new Set(aggregatedData.map(item => item.typeId))];

      for (const typeId of typeIds) {
        const filteredData = aggregatedData.filter(item => item.typeId === typeId);
        console.log(`Filtered Data for ${dataType}_${typeId}:`, filteredData); // Debugging statement

        const { xTrain, yTrain, latestInput, timeSteps } = prepareData(filteredData, 'totalAmount', min, max);

        if (xTrain.length === 0 || yTrain.length === 0) {
          console.error(`No training data for ${dataType}_${typeId}`);
          predictions[`${dataType}_${typeId}`] = 'Not enough data';
          continue;
        }

        const model = createModel(timeSteps);
        await trainModel(model, xTrain, yTrain);

        const nextMonthPrediction = forecastNext(model, latestInput, min, max); // Predicting next month only
        predictions[`${dataType}_${typeId}`] = nextMonthPrediction;
      }
    }

    console.log('Predictions:', predictions); // Debugging statement
    // Save the predictions to the database if needed
    // await savePredictionsToDatabase(userId, predictions);

    res.json({ predictions });
  } catch (error) {
    console.error('Error during prediction:', error); // Log the error for better visibility
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forecastNextMonth };

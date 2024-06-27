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

    const { incomes, expenses, savings } = await fetchData(userId);

    const types = {
      incomes: { data: incomes, typeField: 'income_type_id', amountField: 'income_amount', dateField: 'income_created_at' },
      expenses: { data: expenses, typeField: 'expense_type_id', amountField: 'expense_amount', dateField: 'expense_created_at' },
      savings: { data: savings, typeField: 'saving_type_id', amountField: 'saving_amount', dateField: 'saving_created_at' }
    };

    const predictions = {};

    for (const [dataType, { data, typeField, amountField, dateField }] of Object.entries(types)) {
      const aggregatedData = aggregateDataByTypeAndMonth(data, typeField, amountField, dateField);

      const types = [...new Set(aggregatedData.map(item => item.typeId))];

      for (const type of types) {
        const filteredData = aggregatedData.filter(item => item.typeId === type);
        console.log(`Preparing data for ${dataType}_${type}`); // Debugging statement

        const { xTrain, yTrain, latestInput, timeSteps } = prepareData(filteredData, 'totalAmount');

        if (xTrain.length === 0 || yTrain.length === 0) {
          console.error(`No training data for ${dataType}_${type}`);
          predictions[`${dataType}_${type}`] = 'Not enough data';
          continue;
        }

        const model = createModel(timeSteps);
        await trainModel(model, xTrain, yTrain);

        const nextMonthPrediction = forecastNext(model, latestInput); // Predicting next month only
        predictions[`${dataType}_${type}`] = nextMonthPrediction;
      }
    }

    console.log('Predictions:', predictions); // Debugging statement
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forecastNextMonth };
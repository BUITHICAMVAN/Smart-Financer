const Expense = require('../models/expense/expenseModel');
const Income = require('../models/income/incomeModel');
const Saving = require('../models/saving/savingModel');
const { createModel, trainModel, prepareData, forecastNext } = require('../models/forecastModel');

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

const forecastNextMonth = async (req, res) => {
  try {
    const userId = req.user.user_id;

    if (!userId) {
      throw new Error('User ID is missing');
    }

    const { incomes, expenses, savings } = await fetchData(userId);

    const types = {
      incomes: { data: incomes, field: 'income_amount', typeField: 'income_type_id' },
      expenses: { data: expenses, field: 'expense_amount', typeField: 'expense_type_id' },
      savings: { data: savings, field: 'saving_amount', typeField: 'saving_type_id' }
    };

    const predictions = {};
    const numMonths = 3; // Change this to predict the desired number of months

    for (const [dataType, { data, field, typeField }] of Object.entries(types)) {
      const uniqueTypes = [...new Set(data.map(item => item.dataValues[typeField]))];

      for (const type of uniqueTypes) {
        const filteredData = data.filter(item => item.dataValues[typeField] === type);
        if (filteredData.length > 0) {
          const { xTrain, yTrain, latestInput, timeSteps } = prepareData(filteredData, field);

          if (xTrain.length === 0 || yTrain.length === 0) {
            console.error(`No training data for ${dataType}_${type}`);
            predictions[`${dataType}_${type}`] = 'Not enough data';
            continue;
          }

          const model = createModel(timeSteps);
          await trainModel(model, xTrain, yTrain);

          const nextMonthPrediction = forecastNext(model, latestInput, numMonths); // Predicting multiple months
          predictions[`${dataType}_${type}`] = nextMonthPrediction;
        } else {
          predictions[`${dataType}_${type}`] = 'Not enough data';
        }
      }
    }

    console.log('Predictions:', predictions); // Debugging statement
    res.json({ predictions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { forecastNextMonth };
export const formatForecastData = (forecast) => {
  // Check if the forecast data is present and has the expected structure
  if (!forecast || !Array.isArray(forecast.incomes) || !Array.isArray(forecast.expenses) || !Array.isArray(forecast.savings)) {
    console.error('Invalid forecast data:', forecast);
    return [];
  }

  const aggregatedIncomes = {};
  const aggregatedExpenses = {};
  const aggregatedSavings = {};

  // Aggregate the incomes, expenses, and savings data
  forecast.incomes.forEach(item => {
    aggregatedIncomes[item.income_type_id] = item.forecast;
  });

  forecast.expenses.forEach(item => {
    aggregatedExpenses[item.expense_type_id] = item.forecast;
  });

  forecast.savings.forEach(item => {
    aggregatedSavings[item.saving_type_id] = item.forecast;
  });

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const nextMonth = (currentMonth + 1) % 12;
  const months = [];
  for (let i = nextMonth; i < 12; i++) {
    months.push(new Date(0, i).toLocaleString('default', { month: 'long' }).toLowerCase());
  }

  // Prepare categories
  const incomeCategory = {
    key: 'income',
    category: 'Income',
    children: Object.keys(aggregatedIncomes).map(typeId => {
      const data = { key: typeId, category: `Income Type ${typeId}` };
      months.forEach(month => data[month] = aggregatedIncomes[typeId] || 0);
      return data;
    }),
  };

  const expensesCategory = {
    key: 'expenses',
    category: 'Expenses',
    children: Object.keys(aggregatedExpenses).map(typeId => {
      const data = { key: typeId, category: `Expense Type ${typeId}` };
      months.forEach(month => data[month] = aggregatedExpenses[typeId] || 0);
      return data;
    }),
  };

  const savingsCategory = {
    key: 'savings',
    category: 'Savings',
    children: Object.keys(aggregatedSavings).map(typeId => {
      const data = { key: typeId, category: `Saving Type ${typeId}` };
      months.forEach(month => data[month] = aggregatedSavings[typeId] || 0);
      return data;
    }),
  };

  return [incomeCategory, expensesCategory, savingsCategory];
};

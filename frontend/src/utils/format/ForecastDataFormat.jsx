export const formatForecastData = (forecast, incomeTypes, expenseTypes, savingTypes) => {
  if (!forecast || !Array.isArray(forecast.incomes) || !Array.isArray(forecast.expenses) || !Array.isArray(forecast.savings)) {
    console.log('Formatting data in data format function:', forecast);
    return [];
  }

  const aggregatedIncomes = {};
  const aggregatedExpenses = {};
  const aggregatedSavings = {};

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

  const getIncomeTypeName = (incomeTypeId) => {
    const incomeType = incomeTypes.find(type => type.income_type_id === incomeTypeId);
    return incomeType ? incomeType.income_type_name : 'others';
  };

  const getExpenseTypeName = (expenseTypeId) => {
    const expenseType = expenseTypes.find(type => type.expense_type_id === expenseTypeId);
    return expenseType ? expenseType.expense_type_name : 'others';
  };

  const getSavingTypeName = (savingTypeId) => {
    const savingType = savingTypes.find(type => type.saving_type_id === savingTypeId);
    return savingType ? savingType.saving_type_name : 'others';
  };

  const incomeCategory = {
    key: 'income',
    category: 'Income',
    children: Object.keys(aggregatedIncomes).map(typeId => {
      const data = { key: typeId, category: getIncomeTypeName(parseInt(typeId)) };
      months.forEach(month => data[month] = aggregatedIncomes[typeId] || 0);
      return data;
    }),
  };

  const expensesCategory = {
    key: 'expenses',
    category: 'Expenses',
    children: Object.keys(aggregatedExpenses).map(typeId => {
      const data = { key: typeId, category: getExpenseTypeName(parseInt(typeId)) };
      months.forEach(month => data[month] = aggregatedExpenses[typeId] || 0);
      return data;
    }),
  };

  const savingsCategory = {
    key: 'savings',
    category: 'Savings',
    children: Object.keys(aggregatedSavings).map(typeId => {
      const data = { key: typeId, category: getSavingTypeName(parseInt(typeId)) };
      months.forEach(month => data[month] = aggregatedSavings[typeId] || 0);
      return data;
    }),
  };

  return [incomeCategory, expensesCategory, savingsCategory];
};

// utils/expenseTypeUtils.js
export const getExpenseTypeName = (expenseTypeId, expenseTypes) => {
  const expenseType = expenseTypes.find(type => type.expense_type_id === expenseTypeId);
  return expenseType ? expenseType.expense_type_name : 'Unknown';
};

export const getExpenseTypeId = (expenseTypeName, expenseTypes) => {
  const expenseType = expenseTypes.find(type => type.expense_type_name === expenseTypeName);
  return expenseType ? expenseType.expense_type_id : null;
};

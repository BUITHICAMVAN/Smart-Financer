export const getIncomeTypeName = (incomeTypeId, incomeTypes) => {
  const incomeType = incomeTypes.find(type => type.income_type_id === incomeTypeId);
  return incomeType ? incomeType.income_type_name : 'Unknown';
};

export const getIncomeTypeId = (incomeTypeName, incomeTypes) => {
  const incomeType = incomeTypes.find(type => type.income_type_name === incomeTypeName);
  return incomeType ? incomeType.income_type_id : null;
};

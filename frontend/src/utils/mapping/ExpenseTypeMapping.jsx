const expenseTypeMap = {
    'essentials': 1,
    'nonEssentials': 2
};

export const getExpenseTypeID = (expenseTypeName) => {
    return expenseTypeMap[expenseTypeName];
};

export const getExpenseTypeName = (expenseTypeId) => {
    const entry = Object.entries(expenseTypeMap).find(([key, value]) => value === expenseTypeId);
    return entry ? entry[0] : null;
};

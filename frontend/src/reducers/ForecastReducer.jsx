import { createSlice } from '@reduxjs/toolkit';
import { http } from '../utils/Config';

// Initial state
const initialState = {
  incomes: [],
  expenses: [],
  savings: [],
};

const formatForecastData = (forecast, incomeTypes, expenseTypes, savingTypes) => {
  if (!forecast || typeof forecast !== 'object') {
    console.error('Invalid forecast data:', forecast);
    return { incomes: [], expenses: [], savings: [] };
  }

  const aggregatedIncomes = {};
  const aggregatedExpenses = {};
  const aggregatedSavings = {};

  Object.keys(forecast).forEach(key => {
    const [type, typeId] = key.split('_');
    const value = forecast[key];

    if (type === 'incomes') {
      aggregatedIncomes[parseInt(typeId)] = value;
    } else if (type === 'expenses') {
      aggregatedExpenses[parseInt(typeId)] = value;
    } else if (type === 'savings') {
      aggregatedSavings[parseInt(typeId)] = value;
    }
  });

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

  return {
    incomes: Object.keys(aggregatedIncomes).map(typeId => ({
      income_type_id: parseInt(typeId),
      income_type_name: getIncomeTypeName(parseInt(typeId)),
      forecast: aggregatedIncomes[parseInt(typeId)] || []
    })),
    expenses: Object.keys(aggregatedExpenses).map(typeId => ({
      expense_type_id: parseInt(typeId),
      expense_type_name: getExpenseTypeName(parseInt(typeId)),
      forecast: aggregatedExpenses[parseInt(typeId)] || []
    })),
    savings: Object.keys(aggregatedSavings).map(typeId => ({
      saving_type_id: parseInt(typeId),
      saving_type_name: getSavingTypeName(parseInt(typeId)),
      forecast: aggregatedSavings[parseInt(typeId)] || []
    }))
  };
};

const forecastSlice = createSlice({
  name: 'forecastReducer',
  initialState,
  reducers: {
    setForecastAction: (state, action) => {
      const { forecast, incomeTypes, expenseTypes, savingTypes } = action.payload;
      const formattedData = formatForecastData(forecast, incomeTypes, expenseTypes, savingTypes);
      console.log("data", formattedData);
      state.incomes = formattedData.incomes;
      state.expenses = formattedData.expenses;
      state.savings = formattedData.savings;
    },
  },
});

export const { setForecastAction } = forecastSlice.actions;

export default forecastSlice.reducer;

// Async action to fetch forecast data
export const fetchForecastDataAsync = () => async (dispatch, getState) => {
  try {
    console.log("Fetching forecast data...");
    const response = await http.get('forecast/next-month');
    const { predictions } = response.data;
    console.log("Fetched forecast data:", predictions);

    const state = getState();
    const incomeTypes = state.transactionTypeReducer.transactionTypes.incomeTypes || [];
    const savingTypes = state.transactionTypeReducer.transactionTypes.savingTypes || [];
    const expenseTypes = state.expenseTypeReducer.expenseTypes;

    dispatch(setForecastAction({
      forecast: predictions,
      incomeTypes,
      expenseTypes,
      savingTypes
    }));
  } catch (error) {
    console.error('Failed to fetch forecast data:', error);
  }
};

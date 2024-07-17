import { createSlice } from '@reduxjs/toolkit';
import { http } from '../utils/Config';

// Initial state
const initialState = {
  incomes: [],
  expenses: [],
  savings: [],
};

// Helper function to format forecast data
const formatForecastData = (forecast) => {
  const incomes = [];
  const expenses = [];
  const savings = [];

  Object.keys(forecast).forEach((key) => {
    const [type, typeId] = key.split('_');
    const value = forecast[key];

    if (type === 'incomes') {
      incomes.push({ income_type_id: parseInt(typeId, 10), forecast: value });
    } else if (type === 'expenses') {
      expenses.push({ expense_type_id: parseInt(typeId, 10), forecast: value });
    } else if (type === 'savings') {
      savings.push({ saving_type_id: parseInt(typeId, 10), forecast: value });
    }
  });

  return { incomes, expenses, savings };
};

// Forecast slice
const forecastSlice = createSlice({
  name: 'forecastReducer',
  initialState,
  reducers: {
    setForecastAction: (state, action) => {
      const formattedData = formatForecastData(action.payload);
      state.incomes = formattedData.incomes;
      state.expenses = formattedData.expenses;
      state.savings = formattedData.savings;
    },
  },
});

export const { setForecastAction } = forecastSlice.actions;

export default forecastSlice.reducer;

// Async action to fetch forecast data
export const fetchForecastDataAsync = () => async (dispatch) => {
  try {
    const response = await http.get('forecast/next-month');
    const { predictions } = response.data;
    dispatch(setForecastAction(predictions));
  } catch (error) {
    console.error('Failed to fetch forecast data:', error);
  }
};

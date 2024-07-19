import { configureStore } from "@reduxjs/toolkit";
import TransactionReducer from "../TransactionReducer";
import TransactionTypeReducer from "../TransactionTypeReducer";
import UserReducer from "../UserReducer";
import ExpenseReducer from "../ExpenseReducer";
import ExpenseTypeReducer from "../ExpenseTypeReducer";
import DueReducer from "../DueReducer";
import CategoryFormReducer from "../CategoryFormReducer";
import RatesReducer from "../RatesReducer";
import BudgetReducer from "../BudgetReducer";
import ForecastReducer from "../ForecastReducer";
import AuthReducer from "../AuthReducer";

export const store = configureStore({
  reducer: {
    authReducer: AuthReducer,
    transactionTypeReducer: TransactionTypeReducer,
    transactionReducer: TransactionReducer,
    ratesReducer: RatesReducer,
    userReducer: UserReducer,
    expenseReducer: ExpenseReducer,
    expenseTypeReducer: ExpenseTypeReducer,
    dueReducer: DueReducer,
    categoryFormReducer: CategoryFormReducer,
    budgetReducer: BudgetReducer,
    forecastReducer: ForecastReducer,
  },
});

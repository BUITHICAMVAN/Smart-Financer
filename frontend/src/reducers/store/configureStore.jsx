import { configureStore } from '@reduxjs/toolkit'
import TransactionReducer from '../TransactionReducer'
import TransactionTypeReducer from '../TransactionTypeReducer'
import CurrencyReducer from '../CurrencyReducer'
import UserReducer from '../UserReducer'
import ExpenseReducer from '../ExpenseReducer'
import ExpenseTypeReducer from '../ExpenseTypeReducer'

export const store = configureStore({
    reducer: {
        transactionTypeReducer: TransactionTypeReducer,
        transactionReducer: TransactionReducer,
        currencyReducer: CurrencyReducer, 
        userReducer: UserReducer,
        expenseReducer: ExpenseReducer,
        expenseTypeReducer: ExpenseTypeReducer
        
    }
})
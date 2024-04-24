import { configureStore } from '@reduxjs/toolkit'
import TransactionReducer from '../TransactionReducer'
import IncomeTypeReducer from '../IncomeTypeReducer'

export const store = configureStore({
    reducer: {
        incomeTypeReducer: IncomeTypeReducer,
        transactionReducer: TransactionReducer
    }
})
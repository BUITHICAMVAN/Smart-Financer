import { configureStore } from '@reduxjs/toolkit'
import TransactionReducer from '../TransactionReducer'
import TransactionTypeReducer from '../TransactionTypeReducer'

export const store = configureStore({
    reducer: {
        transactionTypeReducer: TransactionTypeReducer,
        transactionReducer: TransactionReducer
    }
})
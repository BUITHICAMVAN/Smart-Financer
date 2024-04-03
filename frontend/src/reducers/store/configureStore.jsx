import {configureStore} from '@reduxjs/toolkit'
import IncomeReducer from '../IncomeReducer'

export const store = configureStore({
    reducer: {
        incomeReducer: IncomeReducer
    }
})
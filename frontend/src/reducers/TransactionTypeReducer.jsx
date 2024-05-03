import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'

const initialState = {
    transactionTypes: {
        incomeTypes: [],
        savingTypes: []
    }
}

const TransactionTypeReducer = createSlice({
    name: 'transactionTypeReducer',
    initialState,
    reducers: {
        getTransactionTypes: (state, action) => {
            const { type, data } = action.payload // Destructure payload
            state.transactionTypes[type] = data // Update state with new data
        }
    }
})

export const { getTransactionTypes } = TransactionTypeReducer.actions // Corrected typo here

export default TransactionTypeReducer.reducer

// Thunk action to fetch transaction types
export const getTransactionTypesActionAsync = (type) => async (dispatch) => {
    try {
        const res = await http.get(`${type}-types`)
        dispatch(getTransactionTypes({ type: `${type}Types`, data: res.data })) // Ensure to send both type and data
        console.log(initialState.transactionTypes.incomeTypes)
    } catch (error) {
        console.error(`Failed to fetch ${type} types: `, error)
    }
}

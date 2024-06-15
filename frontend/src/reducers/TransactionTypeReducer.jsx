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
        getTransactionTypesAction: (state, action) => {
            const { type, data } = action.payload // Destructure payload
            state.transactionTypes[type] = data // Update state with new data
        }
    }
})

export const { getTransactionTypesAction } = TransactionTypeReducer.actions // Corrected typo here

export default TransactionTypeReducer.reducer

// Thunk action to fetch transaction types
export const getTransactionTypesAsync = (type) => async (dispatch) => {
    try {
        const res = await http.get(`${type}-types`)
        const lowercaseData = res.data.map(item => ({
            [`${type}_type_id`]: item[`${type}_type_id`],
            [`${type}_type_name`]: item[`${type}_type_name`].toLowerCase()
        }))

        const uniqueDataObject = lowercaseData.reduce((acc, current) => {
            acc[current[`${type}_type_id`]] = current
            return acc
        }, {})

        const uniqueData = Object.values(uniqueDataObject)

        dispatch(getTransactionTypesAction({ type: `${type}Types`, data: uniqueData }))
    } catch (error) {
        console.error(`Failed to fetch ${type} types: `, error)
    }
}
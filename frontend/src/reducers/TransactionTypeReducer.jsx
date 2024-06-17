import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'

const initialState = {
    transactionTypes: {
        incomeTypes: [],
        savingTypes: [],
    }
}

const TransactionTypeReducer = createSlice({
    name: 'transactionTypeReducer',
    initialState,
    reducers: {
        getTransactionTypesAction: (state, action) => {
            const { type, data } = action.payload // Destructure payload
            state.transactionTypes[type] = data // Update state with new data
        },
        addTransactionTypeAction: (state, action) => {
            const { type, data } = action.payload
            state.transactionTypes[type].push(data)
        },
        updateTransactionTypeAction: (state, action) => {
            const { type, id, data } = action.payload
            const index = state.transactionTypes[type].findIndex(item => item[`${type}_type_id`] === id)
            if (index !== -1) {
                state.transactionTypes[type][index] = data
            }
        },
        deleteTransactionTypeAction: (state, action) => {
            const { type, id } = action.payload
            state.transactionTypes[type] = state.transactionTypes[type].filter(item => item[`${type}_type_id`] !== id)
        },
    }
})

export const { getTransactionTypesAction, addTransactionTypeAction,
    updateTransactionTypeAction,
    deleteTransactionTypeAction } = TransactionTypeReducer.actions // Corrected typo here

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

export const addTransactionTypeAsync = (type, data) => async (dispatch) => {
    try {
        const res = await http.post(`${type}-types`, data)
        dispatch(addTransactionTypeAction({ type: `${type}Types`, data: res.data }))
    } catch (error) {
        console.error(`Failed to add ${type} type: `, error)
    }
}

export const updateTransactionTypeAsync = (type, id, data) => async (dispatch) => {
    try {
        console.log("test for income update", type, id, data)
        const res = await http.put(`${type}-types/${id}`, data)
        dispatch(updateTransactionTypeAction({ type: `${type}Types`, id, data: res.data }))
    } catch (error) {
        console.error(`Failed to update ${type} type: `, error)
    }
}

export const deleteTransactionTypeAsync = (type, id) => async (dispatch) => {
    try {
        await http.delete(`${type}-types/${id}`)
        dispatch(deleteTransactionTypeAction({ type: `${type}Types`, id }))
    } catch (error) {
        console.error(`Failed to delete ${type} type: `, error)
    }
}
import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'

const initialState = {
    expenseTypes: [],
    expenseTypeName: ''
}

const ExpenseType = createSlice({
    name: 'expenseTypeReducer',
    initialState,
    reducers: {
        getExpenseTypesAction: (state, action) => {
            state.expenseTypes = action.payload
        },
        fetchExpenseTypeNameAction: (state, action) => {
            state.expenseTypeName = action.payload
        },
        addExpenseTypeAction: (state, action) => {
            state.expenseTypes.push(action.payload)
        },
        updateExpenseTypeAction: (state, action) => {
            const { id, data } = action.payload
            const index = state.expenseTypes.findIndex(item => item.expense_type_id === id)
            if (index !== -1) {
                state.expenseTypes[index] = data
            }
        }
    }
})

export const { getExpenseTypesAction, fetchExpenseTypeNameAction, addExpenseTypeAction, updateExpenseTypeAction } = ExpenseType.actions

export default ExpenseType.reducer

export const getExpenseTypesActionAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expense-types')
        const lowercaseData = res.data.map(item => ({
            expense_category_id: item.expense_category_id,
            expense_type_id: item.expense_type_id,
            expense_type_name: item.expense_type_name.toLowerCase(),
        }))
        dispatch(getExpenseTypesAction(lowercaseData))
    } catch (error) {
        console.error('Failed to fetch expense types: ', error)
    }
}

export const fetchExpenseTypeNameActionAsync = (typeId) => async (dispatch) => {
    try {
        const res = await http.get(`expense-types/${typeId}`)
        dispatch(fetchExpenseTypeNameAction(res.data))
    } catch (error) {
        console.error('Failed to fetch expense type name: ', error)
    }
}

export const addExpenseTypeAsync = (data) => async (dispatch) => {
    try {
        const res = await http.post('expense-types', data)
        dispatch(addExpenseTypeAction(res.data))
    } catch (error) {
        console.error('Failed to add expense type: ', error)
    }
}

export const updateExpenseTypeAsync = (id, data) => async (dispatch) => {
    try {
        const res = await http.put(`expense-types/${id}`, data)
        dispatch(updateExpenseTypeAction({ id, data: res.data }))
    } catch (error) {
        console.error('Failed to update expense type: ', error)
    }
}

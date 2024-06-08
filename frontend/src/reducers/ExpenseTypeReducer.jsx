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
        }
    }
})

export const { getExpenseTypesAction, fetchExpenseTypeNameAction } = ExpenseType.actions

export default ExpenseType.reducer

export const getExpenseTypesActionAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expense-types')
        console.log(res.data)

        const lowercaseData = res.data.map(item => ({
            expense_type_id: item.expense_type_id,
            expense_type_name: item.expense_category.toLowerCase()
        }))

        const uniqueDataObject = lowercaseData.reduce((acc, current) => {
            acc[current.expense_type_id] = current
            return acc
        }, {})
        const uniqueData = Object.values(uniqueDataObject)
        dispatch(getExpenseTypesAction(uniqueData))

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
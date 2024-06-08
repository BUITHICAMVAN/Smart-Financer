import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'
import moment from 'moment'
import { getTransactionTypeApi } from '../utils/TypeMapping'
import { getExpenseTypeID } from '../utils/ExpenseTypeMapping'

const initialState = {
    expenses: []
}

const ExpenseReducer = createSlice({
    name: 'expenseReducer',
    initialState,
    reducers: {
        getExpenseAction: (state, action) => {
            state.expenses = action.payload
        },
        addExpenseAction: (state, action) => {
            const { expense } = action.payload // get expense sent from below
            state.expenses.push(expense)
        },
        editExpenseAction: (state, action) => {
            const { expense } = action.payload
            const index = state.expenses.findIndex(e => e.expense_id === expense.expense_id)
            if (index !== -1) {
                state.expenses[index] = expense
            }
        },
        deleteExpenseAction: (state, action) => {
            const { id } = action.payload
            state.expenses = state.expenses.filter(expense => expense.expense_id !== id)
        }
    }
})

export const { getExpenseAction, addExpenseAction, editExpenseAction, deleteExpenseAction } = ExpenseReducer.actions

export default ExpenseReducer.reducer

export const getExpenseActionAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expenses')
        dispatch(getExpenseAction(res.data))
    } catch (error) {
        console.error('Failed to fetch expenses:', error)
    }
}

export const addExpenseActionAsync = (formData) => async (dispatch) => {
    try {
        const dateFormat = 'YYYY-MM-DD'

        if (moment.isMoment(formData.expense_created_at) || moment.isDate(new Date(formData.expense_created_at))) {
            formData.expense_created_at = moment(formData.expense_created_at).format(dateFormat)
        } else {
            console.error('Date is undefined or not a valid date object')
            throw new Error('Invalid date')
        }

        const res = await http.post('expenses', formData)
        dispatch(addExpenseAction({ expense: formData }))
        alert('Transaction added successfully!')
        dispatch(getExpenseActionAsync())
    } catch (error) {
        console.error('Failed to add transaction:', error)
        alert('Failed to add transaction.')
    }
}

export const editExpenseActionAsync = (id, formData) => async (dispatch) => {
    try {
        const dateFormat = 'YYYY-MM-DD' // define date format

        if (typeof formData !== 'object' || formData === null) {
            throw new Error('formData is not a valid object')
        }

        if (moment.isMoment(formData.expense_created_at) || moment.isDate(new Date(formData.expense_created_at))) {
            formData.expense_created_at = moment(formData.expense_created_at).format(dateFormat)
        } else {
            console.error('Date is undefined or not a valid date object')
            throw new Error('Invalid date')
        }

        await http.put(`expenses/${id}`, formData) // tells js to pause until the Promise resolves
        dispatch(editExpenseAction({ expense: formData })) // add payload and dispatch action
        alert('Transaction edited successfully!')
        dispatch(getExpenseActionAsync())
    } catch (error) {
        console.error('Failed to edit transaction:', error)
        alert('Failed to edit transaction.')
    }
}

export const deleteExpenseActionAsync = (id) => async (dispatch) => {
    try {
        await http.delete(`expenses/${id}`) // tells js to pause until the Promise resolves
        dispatch(deleteExpenseAction({ id })) // add payload and dispatch action
        alert('Transaction deleted successfully!')
        dispatch(getExpenseActionAsync())
    } catch (error) {
        console.error('Failed to delete transaction:', error)
        alert('Failed to delete transaction.')
    }
}

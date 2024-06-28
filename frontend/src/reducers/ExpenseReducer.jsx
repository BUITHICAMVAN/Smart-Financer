import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'
import moment from 'moment'

const initialState = {
    expenses: [],
    expenseCategories: [], // Array to store expense categories
    currentMonthExpenses: []
}

const ExpenseReducer = createSlice({
    name: 'expenseReducer',
    initialState,
    reducers: {
        getExpenseAction: (state, action) => {
            state.expenses = action.payload
        },
        addExpenseAction: (state, action) => {
            state.expenses.push(action.payload)
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
        },
        setExpenseCategories: (state, action) => {
            state.expenseCategories = action.payload
        },
        setCurrentMonthExpenses: (state, action) => {
            state.currentMonthExpenses = action.payload
        }
    }
})

export const { getExpenseAction, addExpenseAction, editExpenseAction, deleteExpenseAction, setExpenseCategories, setCurrentMonthExpenses } = ExpenseReducer.actions

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
        dispatch(addExpenseAction(res.data))
        alert('Transaction added successfully!')
        dispatch(getExpenseActionAsync())
    } catch (error) {
        console.error('Failed to add transaction:', error)
        alert('Failed to add transaction.')
    }
}

export const editExpenseActionAsync = (id, formData) => async (dispatch) => {
    try {
        const dateFormat = 'YYYY-MM-DD'

        if (typeof formData !== 'object' || formData === null) {
            throw new Error('formData is not a valid object')
        }

        if (moment.isMoment(formData.expense_created_at) || moment.isDate(new Date(formData.expense_created_at))) {
            formData.expense_created_at = moment(formData.expense_created_at).format(dateFormat)
        } else {
            console.error('Date is undefined or not a valid date object')
            throw new Error('Invalid date')
        }

        const res = await http.put(`expenses/${id}`, formData)
        dispatch(editExpenseAction({ expense: res.data }))
        alert('Transaction edited successfully!')
        dispatch(getExpenseActionAsync())
    } catch (error) {
        console.error('Failed to edit transaction:', error)
        alert('Failed to edit transaction.')
    }
}

export const deleteExpenseActionAsync = (id) => async (dispatch) => {
    try {
        await http.delete(`expenses/${id}`)
        dispatch(deleteExpenseAction({ id }))
        alert('Transaction deleted successfully!')
        dispatch(getExpenseActionAsync())
    } catch (error) {
        console.error('Failed to delete transaction:', error)
        alert('Failed to delete transaction.')
    }
}

// Function to fetch expense categories
export const getExpenseCategoriesAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expense-types')
        dispatch(setExpenseCategories(res.data))
    } catch (error) {
        console.error('Failed to fetch expense categories: ', error)
    }
}

// Function to fetch the expenses for the current month
export const fetchCurrentMonthExpensesAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expenses')
        const expenses = res.data

        // Get start and end of the current month
        const startOfMonth = moment().startOf('month')
        const endOfMonth = moment().endOf('month')

        // Filter expenses that fall within the current month
        const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = moment(expense.expense_created_at)
            return expenseDate.isBetween(startOfMonth, endOfMonth, null, '[]')
        })

        // Dispatch the expenses for the current month
        dispatch(setCurrentMonthExpenses(currentMonthExpenses))
    } catch (error) {
        console.error('Failed to fetch current month expenses:', error)
    }
}
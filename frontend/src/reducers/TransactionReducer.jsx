import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config';
import moment from 'moment';

const initialState = {
    transactions: {
        incomes: [],
        savings: [],
        expenses: {
            needs: [],
            wants: []
        }
    }
}

const TransactionReducer = createSlice({
    name: 'transactionReducer',
    initialState,
    reducers: {
        getTransactionsAction: (state, action) => {
            const { type, data } = action.payload
            state.transactions[type] = data
        },
        deleteTransactionAction: (state, action) => {
            const { transType, transId } = action.payload
            state.transactions[transType] = state.transactions[transType].filter(
                item => item.id !== transId // Assumes each transaction has a unique `id`
            );
        },
        addTransactionAction: (state, action) => {
            const { transType, transForm } = action.payload
            state.transactions[transType].push(transForm)
        },
        editTransactionAction: (state, action) => {
            const { transType, transId, transNew } = action.payload
            const index = state.transactions[transType].findIndex(item => item.id === transId)
            state.transactions[transType][index] = transNew
        }
    }
});

export const { getTransactionsAction, deleteTransactionAction, addTransactionAction, editTransactionAction } = TransactionReducer.actions

export default TransactionReducer.reducer

export const getTransactionsActionAsync = (type) => async (dispatch) => {
    try {
        const res = await http.get(`${type}`)
        dispatch(getTransactionsAction({ type, data: res.data }));
    } catch (error) {
        console.error(`Failed to fetch ${type}:`, error)
    }
}

export const deleteTransactionActionAsync = (type, id) => async (dispatch) => {
    try {
        const res = await http.delete(`${type}/${id}`)
        if (res.status === 200) {
            dispatch(deleteTransactionAction({ transType: type, transId: id }))
            alert('Transaction deleted successfully!')
            dispatch(getTransactionsActionAsync(`${type}`))
        }
    } catch (error) {
        console.error(`Failed to delete ${type}:`, error)
    }
}

export const addTransactionActionAsync = (type, formData) => async (dispatch) => {
    try {
        const dateFormat = 'YYYY-MM-DD'
        if (typeof formData.income_created_at === 'string') {
            formData.income_created_at = moment(formData.income_created_at);
        }
        if (formData.income_created_at && formData.income_created_at.format) {
            formData.income_created_at = formData.income_created_at.format(dateFormat);
        } else {
            console.error("Date is undefined or not a moment object")
            throw new Error("Invalid date")
        }
        const res = await http.post(`${type}`, formData) // tells js to pause untill the Promise resolves
        dispatch(addTransactionAction({ transType: type, transForm: formData })) // add payload and dispatch action
        alert('Transaction added successfully!')
        dispatch(getTransactionsActionAsync(`${type}`))
    } catch (error) {
        console.error('Failed to add transaction:', error)
        alert('Failed to add transaction.')
    }
}

export const editTransactionActionAsync = (type, newData, incomeId) => async (dispatch) => {
    try {
        const res = await http.put(`${type}/${incomeId}`, newData)
        dispatch(editTransactionAction({ transType: type, transId: incomeId, transNew: newData }))
        alert('Transaction updated successfully!')
        dispatch(getTransactionsActionAsync(`${type}`))
    } catch (error) {
        console.error('Failed to edit transaction:', error);
        alert('Failed to edit transaction.')
    }
}
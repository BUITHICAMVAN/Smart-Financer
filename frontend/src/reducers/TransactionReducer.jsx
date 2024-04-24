import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config';

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
        updateTransactionAction: (state, action) => {
            const { transType, transId, transNew } = action.payload
            const index = state.transactions[transType].findIndex(item => item.id === transId)
            state.transactions[transType][index] = transNew
        }
    }
});

export const { getTransactionsAction, deleteTransactionAction, addTransactionAction, updateTransactionAction } = TransactionReducer.actions

export default TransactionReducer.reducer

export const getTransactionsActionAsync = (type) => async (dispatch) => {
    try {
        const res = await http.get(`${type}`)
        console.log(res.data)
        dispatch(getTransactionsAction({ type, data: res.data }));
    } catch (error) {
        console.error(`Failed to fetch ${type}:`, error);
    }
}

export const deleteTransactionActionAsync = (type, id) => async (dispatch) => {
    try {
        const res = await http.delete(`${type}/${id}`)
        if (res.status === 200) {
            dispatch(deleteTransactionAction({ transType: type, transId: id }))
        }
    } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
    }
}

export const addTransactionActionAsync = (type, formData) => async (dispatch) => {
    try {
        if (formData.income_created_at && formData.income_created_at.format) {
            formData.income_created_at = formData.income_created_at.format('YYYY-MM-DD');
        } else {
            console.error("Date is undefined or not a moment object")
            throw new Error("Invalid date")
        }
        const res = await http.post(`${type}`, formData) // tells js to pause untill the Promise resolves
        dispatch(addTransactionAction({ transType: type, transForm: formData }))
        alert('Transaction added successfully!');
    } catch (error) {
        console.error('Failed to add transaction:', error);
        alert('Failed to add transaction.');
    }
}
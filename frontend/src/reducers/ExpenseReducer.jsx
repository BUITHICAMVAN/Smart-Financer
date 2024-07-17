import { createSlice } from '@reduxjs/toolkit';
import { http } from '../utils/Config';
import moment from 'moment';

const initialState = {
    expenses: [],
    expenseCategories: [],
    currentMonthExpenses: [],
    currentMonthEssentialExpenses: [],
    currentMonthNonEssentialExpenses: []
};

const ExpenseReducer = createSlice({
    name: 'expenseReducer',
    initialState,
    reducers: {
        getExpenseAction: (state, action) => {
            state.expenses = action.payload;
        },
        addExpenseAction: (state, action) => {
            state.expenses.push(action.payload);
        },
        editExpenseAction: (state, action) => {
            const { expense } = action.payload;
            const index = state.expenses.findIndex(e => e.expense_id === expense.expense_id);
            if (index !== -1) {
                state.expenses[index] = { ...state.expenses[index], ...expense };
            }
        },
        deleteExpenseAction: (state, action) => {
            const { id } = action.payload;
            state.expenses = state.expenses.filter(expense => expense.expense_id !== id);
        },
        setExpenseCategories: (state, action) => {
            state.expenseCategories = action.payload;
        },
        setCurrentMonthExpenses: (state, action) => {
            state.currentMonthExpenses = action.payload;
        },
        setCurrentMonthEssentialExpenses: (state, action) => {
            state.currentMonthEssentialExpenses = action.payload;
        },
        setCurrentMonthNonEssentialExpenses: (state, action) => {
            state.currentMonthNonEssentialExpenses = action.payload;
        }
    }
});

export const {
    getExpenseAction,
    addExpenseAction,
    editExpenseAction,
    deleteExpenseAction,
    setExpenseCategories,
    setCurrentMonthExpenses,
    setCurrentMonthEssentialExpenses,
    setCurrentMonthNonEssentialExpenses
} = ExpenseReducer.actions;

export default ExpenseReducer.reducer;

export const getExpenseActionAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expenses');
        dispatch(getExpenseAction(res.data));
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
    }
};

export const addExpenseActionAsync = (formData) => async (dispatch) => {
    try {
        const dateFormat = 'YYYY-MM-DD';

        if (moment.isMoment(formData.expense_created_at) || moment.isDate(new Date(formData.expense_created_at))) {
            formData.expense_created_at = moment(formData.expense_created_at).format(dateFormat);
        } else {
            console.error('Date is undefined or not a valid date object');
            throw new Error('Invalid date');
        }

        const res = await http.post('expenses', formData);
        dispatch(addExpenseAction(res.data));
        dispatch(getExpenseActionAsync());
    } catch (error) {
        console.error('Failed to add expense:', error);
    }
};

export const editExpenseActionAsync = (id, formData) => async (dispatch) => {
    try {
        const dateFormat = 'YYYY-MM-DD';

        if (typeof formData !== 'object' || formData === null) {
            throw new Error('formData is not a valid object');
        }

        if (moment.isMoment(formData.expense_created_at) || moment.isDate(new Date(formData.expense_created_at))) {
            formData.expense_created_at = moment(formData.expense_created_at).format(dateFormat);
        } else {
            console.error('Date is undefined or not a valid date object');
            throw new Error('Invalid date');
        }

        const res = await http.put(`expenses/${id}`, formData);
        dispatch(editExpenseAction({ expense: res.data }));
        dispatch(getExpenseActionAsync());
    } catch (error) {
        console.error('Failed to edit expense:', error);
    }
};

export const deleteExpenseActionAsync = (id) => async (dispatch) => {
    try {
        await http.delete(`expenses/${id}`);
        dispatch(deleteExpenseAction({ id }));
        dispatch(getExpenseActionAsync());
    } catch (error) {
        console.error('Failed to delete expense:', error);
    }
};

// Function to fetch expense categories
export const getExpenseCategoriesAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expense-types');
        dispatch(setExpenseCategories(res.data));
    } catch (error) {
        console.error('Failed to fetch expense categories: ', error);
    }
};

// Function to fetch the expenses for the current month
export const fetchCurrentMonthExpensesAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expenses');
        const expenses = res.data;

        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');

        const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = moment(expense.expense_created_at);
            return expenseDate.isBetween(startOfMonth, endOfMonth, null, '[]');
        });

        dispatch(setCurrentMonthExpenses(currentMonthExpenses));
    } catch (error) {
        console.error('Failed to fetch current month expenses:', error);
    }
};

// Function to fetch the expenses by type for the current month
export const fetchCurrentMonthExpensesByTypeAsync = () => async (dispatch) => {
    try {
        const res = await http.get('expenses');
        const expenses = res.data;

        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');

        const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = moment(expense.expense_created_at);
            return expenseDate.isBetween(startOfMonth, endOfMonth, null, '[]');
        });

        const essentialExpenses = currentMonthExpenses.filter(expense => expense.ExpenseType.ExpenseCategory.expense_category_name === 'essentials');
        const nonEssentialExpenses = currentMonthExpenses.filter(expense => expense.ExpenseType.ExpenseCategory.expense_category_name === 'non-essentials');

        dispatch(setCurrentMonthEssentialExpenses(essentialExpenses));
        dispatch(setCurrentMonthNonEssentialExpenses(nonEssentialExpenses));
    } catch (error) {
        console.error('Failed to fetch current month expenses by type:', error);
    }
};
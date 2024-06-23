import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { http } from '../utils/Config'

// Initial state
const initialState = {
  budgets: [],
  budgetTypes: [],
}

// Budget slice
const BudgetReducer = createSlice({
  name: 'budgetReducer',
  initialState,
  reducers: {
    getBudgetAction: (state, action) => {
      state.budgets = action.payload
    },
    addBudgetAction: (state, action) => {
      state.budgets.push(action.payload)
    },
    editBudgetAction: (state, action) => {
      const index = state.budgets.findIndex(b => b.budget_id === action.payload.budget.budget_id)
      if (index !== -1) {
        state.budgets[index] = action.payload.budget
      }
    },
    deleteBudgetAction: (state, action) => {
      state.budgets = state.budgets.filter(budget => budget.budget_id !== action.payload.id)
    },
    setBudgetTypes: (state, action) => {
      state.budgetTypes = action.payload
    },
  },
})

export const {
  getBudgetAction,
  addBudgetAction,
  editBudgetAction,
  deleteBudgetAction,
  setBudgetTypes,
} = BudgetReducer.actions

export default BudgetReducer.reducer

// Fetch related ID and type based on budget name
const fetchRelatedIdAndType = async (budgetName) => {
  const [incomeTypes, savingTypes, expenseTypes] = await Promise.all([
    http.get('income-types'),
    http.get('saving-types'),
    http.get('expense-categories'),
  ])

  const typeMapping = [
    { types: incomeTypes.data, key: 'income_type_name', idKey: 'income_type_id', relatedType: 'income' },
    { types: savingTypes.data, key: 'saving_type_name', idKey: 'saving_type_id', relatedType: 'saving' },
    { types: expenseTypes.data, key: 'expense_type_name', idKey: 'expense_type_id', relatedType: 'expense' }
  ]

  for (const { types, key, idKey, relatedType } of typeMapping) {
    const relatedTypeObj = types.find(type => type[key] === budgetName)
    if (relatedTypeObj) {
      return { relatedId: relatedTypeObj[idKey], relatedType }
    }
  }

  throw new Error('Related type not found')
}

// Async actions
export const addBudgetActionAsync = (formData) => async (dispatch, getState) => {
  try {
    const state = getState()
    const userId = state.user.userId

    const { budget_amount, budget_name } = formData
    const dateFormat = 'YYYY-MM-DD'
    const { relatedId, relatedType } = await fetchRelatedIdAndType(budget_name)

    const newBudget = {
      budget_user_id: userId,
      budget_budget_type_id: 1,
      budget_related_id: relatedId,
      budget_related_type: relatedType,
      budget_amount,
      budget_date: moment().format(dateFormat),
    }

    const res = await http.post('budgets', newBudget)
    dispatch(addBudgetAction(res.data))
    alert('Budget added successfully!')
    dispatch(getBudgetActionAsync(userId))
  } catch (error) {
    console.error('Failed to add budget:', error)
    alert('Failed to add budget.')
  }
}

export const getBudgetActionAsync = () => async (dispatch) => {
  try {
    const res = await http.get(`budgets`)
    dispatch(getBudgetAction(res.data))
  } catch (error) {
    console.error('Failed to fetch budgets:', error)
  }
}

export const editBudgetActionAsync = (id, formData) => async (dispatch, getState) => {
  try {
    const state = getState()
    const userId = state.user.userId

    const dateFormat = 'YYYY-MM-DD'
    formData.budget_date = moment(formData.budget_date).isValid()
      ? moment(formData.budget_date).format(dateFormat)
      : new Error('Invalid date')

    const res = await http.put(`budgets/${id}`, formData)
    dispatch(editBudgetAction({ budget: res.data }))
    alert('Budget edited successfully!')
    dispatch(getBudgetActionAsync(userId))
  } catch (error) {
    console.error('Failed to edit budget:', error)
    alert('Failed to edit budget.')
  }
}

export const deleteBudgetActionAsync = (id) => async (dispatch) => {
  try {
    await http.delete(`budgets/${id}`)
    dispatch(deleteBudgetAction({ id }))
    alert('Budget deleted successfully!')
    dispatch(getBudgetActionAsync())
  } catch (error) {
    console.error('Failed to delete budget:', error)
    alert('Failed to delete budget.')
  }
}

// Fetch budget types
export const getBudgetTypesAsync = () => async (dispatch) => {
  try {
    const res = await http.get('budget-types')
    dispatch(setBudgetTypes(res.data))
  } catch (error) {
    console.error('Failed to fetch budget types:', error)
  }
}

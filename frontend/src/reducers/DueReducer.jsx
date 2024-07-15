import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'
import moment from 'moment'

const initialState = {
  dues: [],
}

const DueReducer = createSlice({
  name: 'dueReducer',
  initialState,
  reducers: {
    getDuesAction: (state, action) => {
      state.dues = action.payload
    },
    addDueAction: (state, action) => {
      const { due } = action.payload
      state.dues.push(due)
    },
    editDueAction: (state, action) => {
      const { due } = action.payload
      const index = state.dues.findIndex(d => d.due_id === due.due_id)
      if (index !== -1) {
        state.dues[index] = { ...state.dues[index], ...due }
      }
    },
    deleteDueAction: (state, action) => {
      const { id } = action.payload
      state.dues = state.dues.filter(due => due.due_id !== id)
    },
    markDueAsPaidAction: (state, action) => {
      const { due_id, paid_status } = action.payload
      const index = state.dues.findIndex(due => due.due_id === due_id)
      if (index !== -1) {
        state.dues[index].paid_status = paid_status
      }
    }
  }
})

export const { getDuesAction, addDueAction, editDueAction, deleteDueAction, markDueAsPaidAction } = DueReducer.actions

export default DueReducer.reducer

export const getDuesActionAsync = () => async (dispatch) => {
  try {
    const res = await http.get('dues')
    dispatch(getDuesAction(res.data))
  } catch (error) {
    console.error('Failed to fetch dues:', error)
  }
}

export const addDueActionAsync = (formData) => async (dispatch) => {
  try {
    const dateFormat = 'YYYY-MM-DD'
    if (moment.isMoment(formData.due_date) || moment.isDate(new Date(formData.due_date))) {
      formData.due_date = moment(formData.due_date).format(dateFormat)
    } else {
      console.error('Date is undefined or not a valid date object')
      throw new Error('Invalid date')
    }
    const res = await http.post('due', formData)
    dispatch(addDueAction({ due: res.data }))
    dispatch(getDuesActionAsync())
  } catch (error) {
    console.error('Failed to add due:', error)
  }
}

export const editDueActionAsync = (id, formData) => async (dispatch) => {
  try {
    const dateFormat = 'YYYY-MM-DD'

    if (typeof formData !== 'object' || formData === null) {
      throw new Error('formData is not a valid object')
    }

    if (moment.isMoment(formData.due_date) || moment.isDate(new Date(formData.due_date))) {
      formData.due_date = moment(formData.due_date).format(dateFormat)
    } else {
      console.error('Date is undefined or not a valid date object')
      throw new Error('Invalid date')
    }

    const res = await http.put(`due/${id}`, formData)
    dispatch(editDueAction({ due: { ...formData, due_id: id } }))
    dispatch(getDuesActionAsync())
  } catch (error) {
    console.error('Failed to edit due:', error)
  }
}

export const deleteDueActionAsync = (id) => async (dispatch) => {
  try {
    await http.delete(`due/${id}`)
    dispatch(deleteDueAction({ id }))
    dispatch(getDuesActionAsync())
  } catch (error) {
    console.error('Failed to delete due:', error)
  }
}

export const markDueAsPaidActionAsync = (id) => async (dispatch) => {
  try {
    const res = await http.patch(`due/${id}/mark-as-paid`)
    dispatch(markDueAsPaidAction({ due_id: id, paid_status: true }))
    dispatch(getDuesActionAsync())
  } catch (error) {
    console.error('Failed to mark due as paid:', error)
  }
}

// Selector to calculate total amount of receivable dues
export const selectTotalReceivableAmount = (state) => {
  const dues = state.dueReducer?.dues || []
  return dues
    .filter(due => due.due_type_id === 1) // Assuming 1 is the ID for 'receivable'
    .reduce((total, due) => total + parseFloat(due.due_amount), 0)
}

// Selector to calculate total amount of payable dues
export const selectTotalPayableAmount = (state) => {
  const dues = state.dueReducer?.dues || []
  return dues
    .filter(due => due.due_type_id === 2) // Assuming 2 is the ID for 'payable'
    .reduce((total, due) => total + parseFloat(due.due_amount), 0)
}

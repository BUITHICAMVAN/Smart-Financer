import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { http } from '../utils/Config'

const initialState = {
  userId: '',
  userCurrencyUnit: '',
  expectedIncome: 0,
  customPercent: {
    needPercent: 0,
    savingPercent: 0,
    wantPercent: 0
  }
}

const UserReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    getPercent: (state, action) => {
      const { userNeedPercent, userSavingPercent, userWantPercent } = action.payload;
      state.customPercent.needPercent = userNeedPercent
      state.customPercent.savingPercent = userSavingPercent
      state.customPercent.wantPercent = userWantPercent
    },
    getExpectedIncome: (state, action) => {
      state.expectedIncome = action.payload
    }
  }
})

export const { setUserId, getPercent, getExpectedIncome } = UserReducer.actions

export default UserReducer.reducer

export const getUserIdAction = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.user_id
      dispatch(setUserId(userId)) // save userId state to store
      return userId // return for another funct call
    }
    return null
  } catch (error) {
    console.log('Failed to fetch user id:', error)
  }
}

export const getUserPercentAsync = () => async (dispatch) => {
  try {
    const id = await dispatch(getUserIdAction())
    if (id) {
      const res = await http.get(`/users/${id}`)
      const userNeedPercent = res.data.user_need_ratio
      const userSavingPercent = res.data.user_saving_ratio
      const userWantPercent = res.data.user_want_ratio
      dispatch(getPercent({ userNeedPercent, userSavingPercent, userWantPercent }))
    }
  } catch (error) {
    console.log('Failed to fetch user ratio:', error)
  }
}

export const getUserExpectedIncomeAsync = () => async (dispatch) => {
  try {
    const id = await dispatch(getUserIdAction())
    if (id) {
      const res = await http.get(`/users/${id}`)
      const userExpectedIncome = res.data.user_expected_income
      dispatch(getExpectedIncome(userExpectedIncome))
    }
  } catch (error) {
    console.log('Failed to fetch user ratio:', error)
  }
}
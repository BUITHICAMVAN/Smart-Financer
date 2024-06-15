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
    setUserIdAction: (state, action) => {
      state.userId = action.payload
    },
    setPercentAction: (state, action) => {
      const { userNeedPercent, userSavingPercent, userWantPercent } = action.payload;
      state.customPercent.needPercent = userNeedPercent
      state.customPercent.savingPercent = userSavingPercent
      state.customPercent.wantPercent = userWantPercent
    },
    setExpectedIncomeAction: (state, action) => {
      state.expectedIncome = action.payload
    },
    setCurrencyUnitAction: (state, action) => {
      state.userCurrencyUnit = action.payload
      console.log(action.payload)
  }
  }
})

export const { setUserIdAction, setPercentAction, setExpectedIncomeAction, setCurrencyUnitAction } = UserReducer.actions

export default UserReducer.reducer

export const setUserIdsAsync = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.user_id
      dispatch(setUserIdAction(userId)) // save userId state to store
      return userId // return for another funct call
    }
    return null
  } catch (error) {
    console.log('Failed to fetch user id:', error)
  }
}

export const getUserPercentAsync = () => async (dispatch) => {
  try {
    const id = await dispatch(setUserIdsAsync())
    if (id) {
      const res = await http.get(`/users/${id}`)
      const userNeedPercent = res.data.user_need_ratio
      const userSavingPercent = res.data.user_saving_ratio
      const userWantPercent = res.data.user_want_ratio
      dispatch(setPercentAction({ userNeedPercent, userSavingPercent, userWantPercent }))
    }
  } catch (error) {
    console.log('Failed to fetch user ratio:', error)
  }
}

export const getUserExpectedIncomeAsync = () => async (dispatch) => {
  try {
    const id = await dispatch(setUserIdsAsync())
    if (id) {
      const res = await http.get(`/users/${id}`)
      const userExpectedIncome = res.data.user_expected_income
      dispatch(setExpectedIncomeAction(userExpectedIncome))
    }
  } catch (error) {
    console.log('Failed to fetch user ratio:', error)
  }
}

// which place/layer should this function be used
export const setCurrentCurrencyAsync = (id) => async (dispatch) => {
  try {
      if (id) {
          const res = await http.get(`/users/${id}`)
          const userCurrentCurrency = res.data.user_currency_unit
          dispatch(setCurrencyUnitAction(userCurrentCurrency))
      }
  } catch (error) {
      console.log('Failed to fetch user currency unit:', error)
  }
}
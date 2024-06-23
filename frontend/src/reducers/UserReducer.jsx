import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { http } from '../utils/Config'

const initialState = {
  userId: '',
  user: {},
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
    setUserAction: (state, action) => {
      state.user = action.payload
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
    }
  }
})

export const { setUserIdAction, setUserAction, setPercentAction, setExpectedIncomeAction, setCurrencyUnitAction } = UserReducer.actions

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

// Update percent values
export const updateUserPercentAsync = ({ userNeedPercent, userSavingPercent, userWantPercent }) => async (dispatch, getState) => {
  try {
    const id = await dispatch(setUserIdsAsync())
    if (id) {
      await http.put(`/users/${id}`, { user_need_ratio: userNeedPercent, user_saving_ratio: userSavingPercent, user_want_ratio: userWantPercent })
      dispatch(setPercentAction({ userNeedPercent, userSavingPercent, userWantPercent }))
    }
    dispatch(getUserPercentAsync())
  } catch (error) {
    console.log('Failed to update user percent:', error)
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

// New function to fetch the complete user data
export const fetchUserAsync = () => async (dispatch) => {
  try {
    const id = await dispatch(setUserIdsAsync())
    if (id) {
      const res = await http.get(`/users/${id}`)
      dispatch(setUserAction(res.data))
    }
  } catch (error) {
    console.log('Failed to fetch user data:', error)
  }
}

// Unified update function for all user settings
export const updateUserSettingsAsync = ({ currency, expectedIncome, needPercent, savingPercent, wantPercent }) => async (dispatch, getState) => {
  try {
    const id = await dispatch(setUserIdsAsync())
    if (id) {
      // Assuming there's a unified endpoint to update user settings
      await http.put(`/users/${id}`, {
        user_currency_unit: currency,
        user_expected_income: expectedIncome,
        user_need_ratio: needPercent,
        user_saving_ratio: savingPercent,
        user_want_ratio: wantPercent
      });

      dispatch(setCurrencyUnitAction(currency));
      dispatch(setExpectedIncomeAction(expectedIncome));
      dispatch(setPercentAction({ userNeedPercent: needPercent, userSavingPercent: savingPercent, userWantPercent: wantPercent }));
    }
  } catch (error) {
    console.log('Failed to update user settings:', error);
  }
}

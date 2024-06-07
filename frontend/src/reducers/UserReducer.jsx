import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'
import { http } from '../utils/Config'

const initialState = {
  userId: '',
  userCurrencyUnit: '',
  expectedMonthlyIncome: 0,
  customRatio: {
    needRatio: 0,
    savingRatio: 0,
    wantRatio: 0
  }
}

const UserReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    getRatios: (state, action) => {
      const { userNeedRatio, userSavingRatio, userWantRatio } = action.payload;
      state.customRatio.needRatio = userNeedRatio
      state.customRatio.savingRatio = userSavingRatio
      state.customRatio.wantRatio = userWantRatio
    },
    setRatios: (state, action) => {

    }
  }
})

export const { setUserId, getRatios, setRatios } = UserReducer.actions

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

export const getUserRatiosAction = () => async (dispatch) => {
  try {
    const id = await dispatch(getUserIdAction())
    if (id) {
      const res = await http.get(`/users/${id}`)
      const userNeedRatio = res.data.user_need_ratio
      const userSavingRatio = res.data.user_saving_ratio
      const userWantRatio = res.data.user_want_ratio
      dispatch(getRatios({ userNeedRatio, userSavingRatio, userWantRatio }))
    }
  } catch (error) {
    console.log('Failed to fetch user ratio:', error)
  }
}


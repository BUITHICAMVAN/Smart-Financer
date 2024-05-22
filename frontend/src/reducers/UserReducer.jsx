import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config'
import jwtDecode from 'jwt-decode' // Ensure correct import

const initialState = {
  userId: '',
  userCurrencyUnit: ''
}

const UserReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    setUserCurrencyUnit: (state, action) => {
      state.userCurrencyUnit = action.payload
    }
  }
})

export const { setUserId, setUserCurrencyUnit } = UserReducer.actions

export default UserReducer.reducer

export const getUserIdFromTokenAction = () => {
  const token = localStorage.getItem('token')
  if (token) {
    const decodedToken = jwtDecode(token)
    console.log(decodedToken)
    return decodedToken.userId
  }
  return null
}

export const getUserCurrencyUnitAction = () => async (dispatch) => {
  try {
    const userId = getUserIdFromTokenAction()
    if (userId) {
      dispatch(setUserId(userId)) // Dispatch setUserId action
      const res = await http.get(`/users/${userId}`)
      console.log(res.data)
      dispatch(setUserCurrencyUnit(res.data.userCurrencyUnit)) 
    }
  } catch (error) {
    console.log('Failed to fetch user currency unit:', error)
  }
}

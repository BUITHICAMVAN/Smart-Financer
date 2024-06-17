import { createSlice } from '@reduxjs/toolkit'
import { updateUserSettingsAsync } from './UserReducer'
const initialState = {
}

const CategoryReducer = createSlice({
  name: 'categoryFormReducer',
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { setUserAction } = CategoryReducer.actions

export default CategoryReducer.reducer

export const handleCategoryFormSubmitAsync = (values) => async (dispatch, getState) => {
  try {
    const state = getState()
    const { userCurrencyUnit, expectedIncome, customPercent } = state.userReducer

    const changes = {
      currency: values.currency !== userCurrencyUnit ? values.currency : userCurrencyUnit,
      expectedIncome: values.expectedIncome !== expectedIncome ? values.expectedIncome : expectedIncome,
      needPercent: values.needPercent !== customPercent.needPercent ? values.needPercent : customPercent.needPercent,
      savingPercent: values.savingPercent !== customPercent.savingPercent ? values.savingPercent : customPercent.savingPercent,
      wantPercent: values.wantPercent !== customPercent.wantPercent ? values.wantPercent : customPercent.wantPercent
    }

    await dispatch(updateUserSettingsAsync(changes))
    alert('Changes saved successfully!')
  } catch (error) {
    console.error('Failed to save data:', error)
    alert('Failed to save data.')
  }
}
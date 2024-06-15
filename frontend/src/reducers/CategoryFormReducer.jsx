import { createSlice } from '@reduxjs/toolkit'

const initialState = {
}

const CategoryReducer = createSlice({
  name: 'categoryFormReducer',
  initialState,
  reducers: {}
});

export const {} = CategoryReducer.actions

export default CategoryReducer.reducer

export const handleCategoryFormSubmitAsync = (values) => async (dispatch) => {
  try {
    console.log(values)
  } catch (error) {
    console.error('Failed to save data:', error)
  }
}
import { createSlice } from '@reduxjs/toolkit'
import { http } from '../utils/Config';

const initialState = {
    incomeTypes: []
}

const IncomeTypeReducer = createSlice({
    name: 'incomeTypeReducer',
    initialState,
    getIncomeTypes: (state, action) => {
        state.incomeTypes = action.payload
    }
});

export const { getIncomeTypes } = IncomeTypeReducer.actions

export default IncomeTypeReducer.reducer


export const getIncomeTypeAsync = (newType) => async (dispatch) => {
    try {
        const res = await http.get('income-types')
        // console.log(res.data)
        const action = getIncomeTypes(res.data)
        dispatch(action)
    } catch (error) {
        console.error("Failed to fetch income types:", error);
    }
}

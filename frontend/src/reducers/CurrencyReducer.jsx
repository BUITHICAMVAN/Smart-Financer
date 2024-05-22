import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const CURRENCY_API = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_mSMlyDZZriCdU66iACzyq6ci25PQPgTDLabxr8Kl'

const initialState = {
    currencyUnit: 'VND',
    rates: {
        VND: 1
    }
}

const CurrencyReducer = createSlice({
    name: 'currencyReducer',
    initialState,
    reducers: {
        setCurrencyRate: (state, action) => {
            state.rates = action.payload.rates;
        },
        setCurrencyUnit: (state, action) => {
            state.currencyUnit = action.payload;
        }
    }
});

export const { setCurrencyRate, setCurrencyUnit } = CurrencyReducer.actions

export default CurrencyReducer.reducer

export const fetchCurrencyRates = async (dispatch) => {
    try {
        const res = await axios.get(CURRENCY_API)
        console.log(res)
        dispatch(setCurrencyRate(res.data))
    } catch(error) {
        console.log('Failed to fetch currency rate', error)
    }
}
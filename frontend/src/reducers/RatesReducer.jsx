import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { http } from '../utils/Config'

const API_KEY = '62GeMHQCDdWoCqZ0nbeGOC8CWPh3Kjyj'
const DOMAIN = 'https://api.currencybeacon.com/v1'

const getApiUrl = (endpoint) => `${DOMAIN}/${endpoint}?api_key=${API_KEY}`

const CURRENCY_API = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_mSMlyDZZriCdU66iACzyq6ci25PQPgTDLabxr8Kl'

const initialState = {
    rates: {
        VND: 1
    }
}

const CurrencyReducer = createSlice({
    name: 'ratesReducer',
    initialState,
    reducers: {
        setCurrencyRatesAction: (state, action) => {
            state.rates = action.payload
            console.log(action.payload)
        }
    }
})

export const { setCurrencyRatesAction } = CurrencyReducer.actions

export default CurrencyReducer.reducer

export const fetchCurrencyRatesAsync = () => async (dispatch) => {
    // try {
    //     // const res = await axios.get(getApiUrl('latest'))
    //     const res = await axios.get(CURRENCY_API)
    //     dispatch(setCurrencyRates(res.data.data))
    // } catch(error) {
    //     console.log('Failed to fetch currency rate', error)
    // }
}

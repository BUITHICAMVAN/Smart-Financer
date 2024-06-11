import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { http } from '../utils/Config'

const API_KEY = '62GeMHQCDdWoCqZ0nbeGOC8CWPh3Kjyj'
const DOMAIN = 'https://api.currencybeacon.com/v1'

const getApiUrl = (endpoint) => `${DOMAIN}/${endpoint}?api_key=${API_KEY}`

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
        setCurrencyRates: (state, action) => {
            state.rates = action.payload
            console.log(action.payload)
        },
        setCurrencyUnit: (state, action) => {
            state.currencyUnit = action.payload
            console.log(action.payload)
        }
    }
})

export const { setCurrencyRates, setCurrencyUnit } = CurrencyReducer.actions

export default CurrencyReducer.reducer

export const fetchCurrencyRates = () => async (dispatch) => {
    // try {
    //     // const res = await axios.get(getApiUrl('latest'))
    //     const res = await axios.get(CURRENCY_API)
    //     dispatch(setCurrencyRates(res.data.data))
    // } catch(error) {
    //     console.log('Failed to fetch currency rate', error)
    // }
}

// which place/layer should this function be used
export const getCurrentCurrency = (id) => async (dispatch) => {
    try {
        if (id) {
          const res = await http.get(`/users/${id}`)
          const userCurrentCurrency = res.data.user_currency_unit
          dispatch(setCurrencyUnit(userCurrentCurrency))
        }
      } catch (error) {
        console.log('Failed to fetch user currency unit:', error)
      }
}

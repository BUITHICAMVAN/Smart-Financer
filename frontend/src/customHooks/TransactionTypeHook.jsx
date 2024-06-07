import { useDispatch } from 'react-redux'
import { getTransactionTypesActionAsync } from '../reducers/TransactionTypeReducer'
import { useEffect } from 'react'
const useTransactionType = (type) => {
    const dispatch = useDispatch()

    const fetchTransactionTypes = () => {
        const action = getTransactionTypesActionAsync(type)
        dispatch(action)
    }

    useEffect(() => {
        fetchTransactionTypes(type)
    }, [type])

    return { fetchTransactionTypes }
}
export default useTransactionType
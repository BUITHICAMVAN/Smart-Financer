import { useDispatch } from 'react-redux'
import { getTransactionTypesAsync } from '../reducers/TransactionTypeReducer'
import { useEffect } from 'react'
const useTransactionType = (type) => {
    const dispatch = useDispatch()

    const fetchTransactionTypes = () => {
        const action = getTransactionTypesAsync(type)
        dispatch(action)
    }

    useEffect(() => {
        fetchTransactionTypes(type)
    }, [type])

    return { fetchTransactionTypes }
}
export default useTransactionType
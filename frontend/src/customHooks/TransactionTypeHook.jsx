import { useDispatch } from 'react-redux'
import { getTransactionTypesActionAsync } from '../reducers/TransactionTypeReducer'
const useTransactionType = (type) => {
    const dispatch = useDispatch()

    const fetchTransactionTypes = () => {
        const action = getTransactionTypesActionAsync(type)
        dispatch(action)
    }

    return { fetchTransactionTypes }
}
export default useTransactionType
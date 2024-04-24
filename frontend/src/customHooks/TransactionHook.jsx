import { useDispatch } from 'react-redux'
import { addTransactionActionAsync, deleteTransactionActionAsync, getTransactionsActionAsync } from '../reducers/TransactionReducer'

const useTransaction = (type) => {
    const dispatch = useDispatch()

    const fetchTransactions = () => {
        const action = getTransactionsActionAsync(type)
        dispatch(action)
    }

    const addTransaction = async (formTrans) => {
        const action = addTransactionActionAsync(type, formTrans)
        dispatch(action)
    }

    const removeTransaction = (id) => {
        const action = deleteTransactionActionAsync(type, id)
        dispatch(action)
    }

    const editTransaction = (id) => {

    }

    return { fetchTransactions, addTransaction, removeTransaction, editTransaction }
}
export default useTransaction
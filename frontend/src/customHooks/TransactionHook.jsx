import { useDispatch } from 'react-redux'
import { addTransactionActionAsync, deleteTransactionActionAsync, editTransactionActionAsync, fetchMonthlyAmountAsync, fetchMonthlyTransactionAsync, getTransactionsActionAsync } from '../reducers/TransactionReducer'

const useTransaction = (type) => {
    const dispatch = useDispatch()

    const fetchTransactions = () => {
        dispatch(getTransactionsActionAsync(type));
    };

    const addTransaction = async (formTrans) => {
        await dispatch(addTransactionActionAsync(type, formTrans));
    };

    const removeTransaction = async (id) => {
        await dispatch(deleteTransactionActionAsync(type, id));
    };

    const editTransaction = async (incomeEdit, id) => {
        await dispatch(editTransactionActionAsync(type, incomeEdit, id));
    };

    const fetchCurrentMonthSaving = () => {
        dispatch(fetchMonthlyAmountAsync(type));
    };

    const fetchMonthlyTransaction = () => {
        dispatch(fetchMonthlyTransactionAsync(type));
    };


    return { fetchTransactions, addTransaction, removeTransaction, editTransaction, fetchCurrentMonthSaving, fetchMonthlyTransaction }
}
export default useTransaction
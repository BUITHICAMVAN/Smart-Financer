import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { getCurrentMonth } from '../../utils/CurrentDate'
import { useDispatch, useSelector } from 'react-redux'
import { deleteExpenseActionAsync, fetchCurrentMonthExpensesAsync } from '../../reducers/ExpenseReducer'
import { dateFormat } from '../../utils/format/DateFormat'
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol'
import { setCurrentCurrencyAsync } from '../../reducers/UserReducer'

const History = () => {

    const dispatch = useDispatch()
    const [open, setOpen] = useState(false) // open modal
    const [initialData, setInitialData] = useState(null) // table data for editing modal

    const currentMonth = getCurrentMonth()
    const expenses = useSelector(state => state.expenseReducer.currentMonthExpenses)

    const currencyUnit = useSelector(state => state.userReducer.userCurrencyUnit)

    const handleDelete = (id) => {
        dispatch(deleteExpenseActionAsync(id))
    }

    const handleEdit = (data) => {
        setInitialData(data) // Set data to edit
        setOpen(true)
    }

    useEffect(() => {
        dispatch(setCurrentCurrencyAsync())
    }, [])

    useEffect(() => {
        dispatch(fetchCurrentMonthExpensesAsync())
    }, [])

    return (
        <HistoryStyled>
            <div className="history-con">
                <div className="history-title">
                    <h2>{currentMonth} Transactions</h2>
                    <NavLink to='/expense-page' className={'history-detail'}><h2>View in detail</h2></NavLink>
                </div>
                <div className="history-table text-center">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th><span>Date & Time</span></th>
                                <th><span>Details</span></th>
                                <th><span>Needs</span></th>
                                <th><span>Wants</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.expense_id}>
                                    <td><span className="white-text">{dateFormat(expense.expense_created_at)}</span></td>
                                    <td><span className="white-text">{expense.expense_note}</span></td>
                                    <td><span className={expense.expense_type_id === 1 ? "white-text" : "na-text"}>
                                        {expense.expense_type_id === 1 ? `${getCurrencySymbol(currencyUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span></td>
                                    <td><span className={expense.expense_type_id === 2 ? "white-text" : "na-text"}>
                                        {expense.expense_type_id === 2 ? `${getCurrencySymbol(currencyUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span></td>
                                    <td><span className='edit-btn' onClick={() => handleEdit(expense)}>Edit</span></td>
                                    <td><span className='del-btn' onClick={() => handleDelete(expense.expense_id)}>Delete</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    .history-title {
      display: flex;
      justify-content: space-between;
    }
    .history-detail {
        text-decoration: none;
    }
    .history-detail h2 {
        text-decoration: none;
        color: var(--color-yellow);
        font-weight: 500;
    }
    .white-text {
        color: white;
        font-weight: 400;
    }
    .na-text {
        font-size: 0.7em; /* Decrease font size for "N/A" */
        color: gray; /* Optional: Change color for "N/A" */
    }
    .history-table {
      thead {
        span {
          font-weight: 600;
          color: white;
        }
      }
      tbody > tr {
        background: rgb(0, 0, 0);
      }
    }
    .edit-btn {
        color: var(--edit-btn);
    }
    .del-btn {
        color: var(--delete-btn);
    }
`;

export default History
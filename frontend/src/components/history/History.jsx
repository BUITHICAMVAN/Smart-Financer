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
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchCurrentMonthExpensesAsync())
    }, [dispatch])

    return (
        <HistoryStyled>
            <div className="history-con">
                <div className="history-title">
                    <h2>{currentMonth} Transactions</h2>
                    <NavLink to='/expense-page' className={'history-detail'}><h2>View in detail</h2></NavLink>
                </div>
                <div className="history-table">
                    <div className="history-item header">
                        <div className="row">
                            <div className="column details">
                                <span>Details</span>
                            </div>
                            <div className="column needs">
                                <span>Needs</span>
                            </div>
                            <div className="column wants">
                                <span>Wants</span>
                            </div>
                        </div>
                    </div>
                    {expenses.map((expense, index) => (
                        <div className={`history-item ${index >= 2 ? 'hide-on-mobile' : ''}`} key={expense.expense_id}>
                            <div className="row">
                                <div className="column details">
                                    <span>{expense.expense_category}</span>
                                </div>
                                <div className="column needs">
                                    <span className={expense.expense_type_id === 1 ? "white-text" : "na-text"}>
                                        {expense.expense_type_id === 1 ? `${getCurrencySymbol(currencyUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span>
                                </div>
                                <div className="column wants">
                                    <span className={expense.expense_type_id === 2 ? "white-text" : "na-text"}>
                                        {expense.expense_type_id === 2 ? `${getCurrencySymbol(currencyUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="row actions">
                                <button className="edit-btn" onClick={() => handleEdit(expense)}>Edit</button>
                                <button className="del-btn" onClick={() => handleDelete(expense.expense_id)}>Delete</button>
                            </div>
                            <div className="date">{dateFormat(expense.expense_created_at)}</div>
                        </div>
                    ))}
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
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .history-item {
        position: relative;
        background: var(--component-color);
        border: 2px solid #191a16;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &.header {
            background: transparent;
            border: none;
            box-shadow: none;
            padding-bottom: 0;
        }

        .row {
            display: flex;
            justify-content: center;
            &.actions {
                margin-top: 0.5rem;
                button {
                    width: 25%;
                    background: none;
                    border: none;
                    color: var(--color-white);
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    transition: background 0.3s ease;

                    &.edit-btn {
                        color: var(--edit-btn);
                    }

                    &.del-btn {
                        color: var(--delete-btn);
                    }

                    &:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                }
            }
        }

        .column {
            flex: 1;
            padding: 0.5rem;
            &:nth-child(2) {
                text-align: center;
            }
            &:nth-child(3) {
                text-align: right;
            }
        }

        .date {
            position: absolute;
            bottom: -10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.1); /* Lighter background color */
            padding: 0.25rem 0.5rem;
            border-radius: 10px;
            font-size: 0.75rem;
            color: var(--color-white); /* Adjust text color for contrast */
        }
    }

    @media (max-width: 768px) {
        .hide-on-mobile {
            display: none;
        }
    }
`;

export default History;

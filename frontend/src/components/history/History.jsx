import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { getCurrentMonth } from '../../utils/CurrentDate';
import { useDispatch, useSelector } from 'react-redux';
import { deleteExpenseActionAsync, editExpenseActionAsync, fetchCurrentMonthExpensesAsync } from '../../reducers/ExpenseReducer';
import { dateFormat } from '../../utils/format/DateFormat';
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol';
import { setCurrentCurrencyAsync } from '../../reducers/UserReducer';
import Pagination from '../pagination/Pagination';
import ExpenseModal from '../modals/ExpenseModal';
import { getExpenseTypeName } from '../../utils/mapping/ExpenseTypeMapping';
import { getExpenseTypesActionAsync } from '../../reducers/ExpenseTypeReducer';

const History = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false); // open modal
    const [initialData, setInitialData] = useState(null); // table data for editing modal
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const currentMonth = getCurrentMonth();
    const expenses = useSelector(state => state.expenseReducer.currentMonthExpenses);
    const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes)

    const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit)

    const handleCancel = () => {
        setOpen(false)
        setInitialData(null) // Clear initial data when closing modal
    }

    const handleDelete = (id) => {
        dispatch(deleteExpenseActionAsync(id));
    };

    const handleEdit = (data) => {
        setInitialData(data); // Set data to edit
        setOpen(true);
    };

    const handleSaveEdit = async (id, formData) => {
        try {
            await dispatch(editExpenseActionAsync(id, formData))
            setOpen(false)
        } catch (error) {
            console.error('Failed to edit transaction:', error)
            alert('Failed to edit transaction.')
        }
    }

    useEffect(() => {
        dispatch(setCurrentCurrencyAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCurrentMonthExpensesAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getExpenseTypesActionAsync())
    }, [])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the index of the first and last item on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = expenses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(expenses.length / itemsPerPage);

    return (
        <HistoryStyled>
            <div className="history-con">
                <ExpenseModal
                    open={open}
                    onEdit={handleSaveEdit}
                    onCancel={handleCancel}
                    initialData={initialData}
                />
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
                                <th><span>Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((expense) => (
                                <tr key={expense.expense_id}>
                                    <td><span className="white-text">{dateFormat(expense.expense_created_at)}</span></td>
                                    <td><span className="white-text">{getExpenseTypeName(expense.expense_type_id, expenseTypes)}</span></td>
                                    <td><span className={expense.ExpenseType.ExpenseCategory.expense_category_name === 'essentials' ? "white-text" : "na-text"}>
                                        {expense.ExpenseType.ExpenseCategory.expense_category_name === 'essentials' ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span></td>
                                    <td><span className={expense.ExpenseType.ExpenseCategory.expense_category_name === 'non-essentials' ? "white-text" : "na-text"}>
                                        {expense.ExpenseType.ExpenseCategory.expense_category_name === 'non-essentials' ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span></td>
                                    <td><span className='edit-btn' onClick={() => handleEdit(expense)}>Edit</span></td>
                                    <td><span className='del-btn' onClick={() => handleDelete(expense.expense_id)}>Delete</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </HistoryStyled>
    );
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
        background: transparent;
        td {
            background: var(--component-color);
            border: 1px solid #191a16;
            border-radius: 10px;
            padding: 0.5rem;
        }
        &:hover td {
            background: var(--hover-color); /* Optional: Change color on hover */
        }
      }
    }
    .edit-btn, .del-btn {
        color: var(--edit-btn);
        margin-right: 10px;
        cursor: pointer;
        display: inline-block;
        padding: 0.5rem;
        border-radius: 5px;
        transition: background 0.3s ease;

        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
    .del-btn {
        color: var(--delete-btn);
    }
`;

export default History;

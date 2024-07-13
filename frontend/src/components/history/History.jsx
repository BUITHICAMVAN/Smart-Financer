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
    const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes);

    const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit);

    const handleCancel = () => {
        setOpen(false);
        setInitialData(null); // Clear initial data when closing modal
    };

    const handleDelete = (id) => {
        dispatch(deleteExpenseActionAsync(id));
    };

    const handleEdit = (data) => {
        setInitialData(data); // Set data to edit
        setOpen(true);
    };

    const handleSaveEdit = async (id, formData) => {
        try {
            await dispatch(editExpenseActionAsync(id, formData));
            setOpen(false);
        } catch (error) {
            console.error('Failed to edit transaction:', error);
            alert('Failed to edit transaction.');
        }
    };

    useEffect(() => {
        dispatch(setCurrentCurrencyAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchCurrentMonthExpensesAsync());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getExpenseTypesActionAsync());
    }, []);

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
                    <NavLink to='/expense-page' className='history-detail'><h2>View in detail</h2></NavLink>
                </div>
                <div className="history-table text-center">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th className="date-time"><span>Date & Time</span></th>
                                <th className="detail"><span>Details</span></th>
                                <th className="want"><span>Needs</span></th>
                                <th className="need"><span>Wants</span></th>
                                <th className="action" colSpan="2"><span>Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((expense) => (
                                <tr key={expense.expense_id}>
                                    <td className="date-time"><span className="white-text">{dateFormat(expense.expense_created_at)}</span></td>
                                    <td className="detail"><span className="white-text">{getExpenseTypeName(expense.expense_type_id, expenseTypes)}</span></td>
                                    <td className="need"><span className={expense.ExpenseType.ExpenseCategory.expense_category_name === 'essentials' ? "white-text" : "na-text"}>
                                        {expense.ExpenseType.ExpenseCategory.expense_category_name === 'essentials' ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span></td>
                                    <td className='want'><span className={expense.ExpenseType.ExpenseCategory.expense_category_name === 'non-essentials' ? "white-text" : "na-text"}>
                                        {expense.ExpenseType.ExpenseCategory.expense_category_name === 'non-essentials' ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount}` : 'N/A'}
                                    </span></td>
                                    <td className='action edit-action'><span className='edit-btn' onClick={() => handleEdit(expense)}>Edit</span></td>
                                    <td className="action delete-action"><span className='del-btn' onClick={() => handleDelete(expense.expense_id)}>Delete</span></td>
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
        align-items: center;
        margin-bottom: 1rem;
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
        font-size: 0.7em; 
        color: gray; 
    }
    .history-table {
        thead {
            span {
                font-weight: 600;
                color: white;
            }
        }
        tbody > tr {
            position: relative;
            background: rgba(12, 10, 9, 1);
            border: 1px solid #191a16;
            border-radius: 20px;
            margin-bottom: 2rem;
            td {
                border: none;
                padding: 0.5rem;
            }
            &:hover td {
                background: var(--hover-color); 
            }
        }
        .edit-btn, .del-btn {
            font-size: .75rem;
            font-weight: 500;
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
    }

    @media screen and (max-width: 1280px) {
        table {
            position: relative;
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            tr {
                display: block;
            }
            th {
                display: inline-block;
                width: 30%;
            }
            .date-time, .action {
                display: none;
            }
        }

        tbody {
            tr {
                display: block;
            }
            .detail, .need, .want {
                display: inline-block;
                width: 30%;
            }
            .date-time {
                position: absolute;
                top: 82px;
                right: 20px;
                align-self: flex-end;
                border-radius: 5px;
                color: white;
                span {
                    font-size: 10px;
                    background-color: #444;
                    padding: .25rem .5rem;
                    border-end-end-radius: 10px;
                    border-bottom-left-radius: 10px;
                }
            }
            .action {
                display: inline-block;
                width: 100%;
            }
            .edit-action, .delete-action {
                width: auto;
                display: inline-block;
            }
            .edit-btn, .del-btn {
                color: var(--edit-btn);
                cursor: pointer;
                display: inline-block;
                border-radius: 5px;
                transition: background 0.3s ease;
                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            }
            .del-btn {
                color: var(--delete-btn);
            }
        }
    }
`;

export default History;

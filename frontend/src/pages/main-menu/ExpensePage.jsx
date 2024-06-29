import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import ExpenseModal from '../../components/modals/ExpenseModal';
import { useDispatch, useSelector } from 'react-redux';
import { addExpenseActionAsync, deleteExpenseActionAsync, editExpenseActionAsync, fetchCurrentMonthExpensesAsync } from '../../reducers/ExpenseReducer';
import { dateFormat } from '../../utils/format/DateFormat';
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol';
import useTransaction from '../../customHooks/TransactionHook';
import { getCurrentMonth } from '../../utils/CurrentDate';
import { setCurrentCurrencyAsync } from '../../reducers/UserReducer';
import { getExpenseTypeName } from '../../utils/mapping/ExpenseTypeMapping';
import { getExpenseTypesActionAsync } from '../../reducers/ExpenseTypeReducer';

const ExpensePage = () => {
  const dispatch = useDispatch();
  const { fetchCurrentMonthSaving } = useTransaction('savings');

  const [open, setOpen] = useState(false); // open modal
  const [initialData, setInitialData] = useState(null); // table data for editing modal
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const expenses = useSelector(state => state.expenseReducer.currentMonthExpenses);
  const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes);

  const wants = expenses.filter(expense => expense.expense_category_id === 1);
  const needs = expenses.filter(expense => expense.expense_category_id === 2);

  const totalNeedsAmount = needs.reduce((total, expense) => {
    const amount = parseFloat(expense.expense_amount) || 0;
    return total + amount;
  }, 0);

  const totalWantsAmount = wants.reduce((total, expense) => {
    const amount = parseFloat(expense.expense_amount) || 0;
    return total + amount;
  }, 0);

  const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit);
  const currentMonth = getCurrentMonth();
  const currentMonthSaving = useSelector(state => state.transactionReducer.currentMonthSaving);

  const showModal = () => {
    setInitialData(null); // Clear initial data for adding
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setInitialData(null); // Clear initial data when closing modal
  };

  const handleCreate = async (formData) => {
    try {
      await dispatch(addExpenseActionAsync(formData));
      setOpen(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction.');
    }
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
    dispatch(fetchCurrentMonthExpensesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExpenseTypesActionAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setCurrentCurrencyAsync());
  }, [dispatch]);

  useEffect(() => {
    fetchCurrentMonthSaving();
  }, [fetchCurrentMonthSaving]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = expenses.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(expenses.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <Pagination>
        {pageNumbers.map(number => (
          <PaginationItem key={number} onClick={() => handlePageChange(number)} active={number === currentPage}>
            {number}
          </PaginationItem>
        ))}
      </Pagination>
    );
  };

  return (
    <ExpensePageStyled>
      <InnerLayout>
        <div className='container'>
          <div className="expense-container">
            <div className="content-container content-left text-center">
              <h1> {currentMonth} Entries</h1>
              <hr />
              <div className="expense-content">
                <div className="btn-con">
                  <button className="btn btn-warning" onClick={showModal}>Add Entry</button>
                </div>
                <ExpenseModal
                  open={open}
                  onCreate={handleCreate}
                  onEdit={handleSaveEdit}
                  onCancel={handleCancel}
                  initialData={initialData}
                />
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
                    {currentItems.map((expense) => (
                      <tr key={expense.expense_id}>
                        <td><span className="white-text">{dateFormat(expense.expense_created_at)}</span></td>
                        <td><span className="white-text">{getExpenseTypeName(expense.expense_type_id, expenseTypes)}</span></td>
                        <td><span className={expense.expense_category_id === 2 ? "white-text" : "na-text"}>
                          {expense.expense_category_id === 2 ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount}` : 'N/A'}
                        </span></td>
                        <td><span className={expense.expense_category_id === 1 ? "white-text" : "na-text"}>
                          {expense.expense_category_id === 1 ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount}` : 'N/A'}
                        </span></td>
                        <td><span className='edit-btn' onClick={() => handleEdit(expense)}>Edit</span></td>
                        <td><span className='del-btn' onClick={() => handleDelete(expense.expense_id)}>Delete</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination()}
              </div>
            </div>
            <div className='content-container content-right text-left'>
              <h1 className='text-center'>Expense Insights</h1>
              <hr />
              <div className='insight'>
                <div className="spending">
                  <span className='insight-title'>Spendings</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: {getCurrencySymbol(currentUnit)}{totalNeedsAmount}</p>
                      <p>Wants: {getCurrencySymbol(currentUnit)}{totalWantsAmount}</p>
                    </div>
                    <div className="bracket">
                      <p>{'}'}</p>
                      <p>{getCurrencySymbol(currentUnit)}{totalNeedsAmount + totalWantsAmount}</p>
                    </div>
                  </div>
                </div>
                <div className="money-left">
                  <span className='insight-title'>Money Left</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: {getCurrencySymbol(currentUnit)}</p>
                      <p>Wants: {getCurrencySymbol(currentUnit)}</p>
                    </div>
                    <div className="bracket">
                      <p>{'}'}</p>
                      <p>{getCurrencySymbol(currentUnit)}{currentMonthSaving}</p>
                    </div>
                  </div>
                </div>
                <div className="saving">
                  <span className='insight-title'>Savings</span>
                  <div className="main">
                    <div className="amount">
                      <p>Total Savings: {getCurrencySymbol(currentUnit)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InnerLayout>
    </ExpensePageStyled>
  );
};

const ExpensePageStyled = styled.div`
  h1 {
    font-size: 1.6rem;
    font-weight: 700;
  }
  p {
    font-weight: 500;
  }
  button {
    border-radius: 10px;
    padding: 0.5rem 1rem;
  }
  span {
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }
  .expense-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr) repeat(3, 1fr);
    gap: 2rem;
    .content-left {
      grid-column: span 7; 
    }
    .content-right {
        grid-column: span 3; 
    }
  }
  .btn-con {
    margin: 2rem 0;
    display: flex;
    justify-content: end;
  }
  .table, th, td {
    --bs-table-bg: transparent;
    border: none;
    thead {
      span {
        font-weight: 600;
        color: white;
      }
    }
  }
  .white-text {
    color: white;
    font-weight: 400;
  }
  .na-text {
    font-size: 0.7em; /* Decrease font size for "N/A" */
    color: gray; /* Optional: Change color for "N/A" */
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn); 
  }
  .insight {
    display: grid;
    gap: 1rem;
    .insight-title {
      color: var(--color-yellow);
      font-size: 1rem; 
      font-weight: 600;
      text-decoration: underline;
    }
    .main {
      display: flex;
      flex-direction: row;
      .amount p {
        font-size: 1rem;
        font-family: "Courier Prime", monospace;
        font-weight: 400;
        color: white;
        padding: 0;
        margin: 0;
        line-height: 2rem;
      }
      .bracket {
        display: flex;
        flex-direction: row;
        align-items: center;
        p {
          padding: 0 1rem;
          font-family: "Courier Prime", monospace;
          font-weight: 400;
        }
        p:first-child {
          font-size: 3rem;
          color: var(--bracket-color);
        }
        p:nth-child(2) {
          font-size: 2rem;
          color: white;
          padding: 0;
          margin: 0;
          line-height: 2rem; 
        }
      }
    }
  }
`;

const Pagination = styled.ul`
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  list-style: none;
`;

const PaginationItem = styled.li`
  margin: 0 0.5rem;
  cursor: pointer;
  color: ${({ active }) => (active ? '#fff' : '#fff')};
  background-color: ${({ active }) => (active ? 'var(--color-yellow)' : 'transparent')};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  &:hover {
    background-color: ${({ active }) => (active ? 'var(--color-yellow)' : '#f0f0f0')};
  }
`;

export default ExpensePage;
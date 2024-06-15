import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts'
import ExpenseModal from '../../components/modals/ExpenseModal'
import { useDispatch, useSelector } from 'react-redux'
import { addExpenseActionAsync, deleteExpenseActionAsync, editExpenseActionAsync, getExpenseActionAsync } from '../../reducers/ExpenseReducer'
import { dateFormat } from '../../utils/format/DateFormat'
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol'

const ExpensePage = () => {

  const dispatch = useDispatch()

  const [month, setMonth] = useState('March')

  const [amount, setAmount] = useState("100")
  const [currency, setCurrency] = useState("$")

  const [open, setOpen] = useState(false) // open modal
  const [initialData, setInitialData] = useState(null) // table data for editing modal

  const expenses = useSelector(state => state.expenseReducer.expenses)

  const needs = expenses.filter(expense => expense.expense_type_id === 1)

  const wants = expenses.filter(expense => expense.expense_type_id === 2);

  const totalNeedsAmount = needs.reduce((total, expense) => {
    const amount = parseFloat(expense.expense_amount) || 0;
    return total + amount
  }, 0)

  const totalWantsAmount = wants.reduce((total, expense) => {
    const amount = parseFloat(expense.expense_amount) || 0;
    return total + amount
  }, 0)

  const currencyUnit = useSelector(state => state.ratesReducer.currencyUnit)

  const showModal = () => {
    setInitialData(null) // Clear initial data for adding
    setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
    setInitialData(null) // Clear initial data when closing modal
  }

  const handleCreate = async (formData) => {
    try {
      await dispatch(addExpenseActionAsync(formData))
      setOpen(false)
    } catch (error) {
      console.error('Failed to add transaction:', error)
      alert('Failed to add transaction.')
    }
  }

  const handleDelete = (id) => {
    dispatch(deleteExpenseActionAsync(id))
  }

  const handleEdit = (data) => {
    setInitialData(data) // Set data to edit
    setOpen(true)
  }

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
    dispatch(getExpenseActionAsync())
  }, [])

  return (
    <ExpensePageStyled>
      <InnerLayout>
        <div className='container'>
          <div className="expense-container">
            <div className="content-container content-left text-center">
              <h1>{month} Entries</h1>
              <hr />
              <div className="expense-content">
                <div className="btn-con">
                  <button className="btn btn-dark">Export</button>
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
                    {expenses.map((expense) => (
                      <tr key={expense.expense_id}>
                        <td><span className="white-text">{dateFormat(expense.expense_created_at)}</span></td>
                        <td><span className="white-text">{expense.expense_category}</span></td>
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
            <div className='content-container content-right text-left'>
              <h1 className='text-center'>Expense Insights</h1>
              <hr />
              <div className='insight'>
                <div className="spending">
                  <span className='insight-title'>Spendings</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: ${totalNeedsAmount}</p>
                      <p>Wants: ${totalWantsAmount}</p>
                    </div>
                    <div className="bracket">
                      <p>{'}'}</p>
                      <p>{currency}{totalNeedsAmount+totalWantsAmount}</p>
                    </div>
                  </div>
                </div>
                <div className="money-left">
                  <span className='insight-title'>Money Left</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: ${amount}</p>
                      <p>Wants: ${amount}</p>
                    </div>
                    <div className="bracket">
                      <p>{'}'}</p>
                      <p>{currency}200</p>
                    </div>
                  </div>
                </div>
                <div className="saving">
                  <span className='insight-title'>Savings</span>
                  <div className="main">
                    <div className="amount">
                      <p>Total Savings: 200</p>
                    </div>c
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InnerLayout>
    </ExpensePageStyled>
  )
}

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
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn); 
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

export default ExpensePage
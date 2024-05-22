import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts'
import { useDispatch, useSelector } from 'react-redux'
import useTransaction from '../../customHooks/TransactionHook'
import TransactionModal from '../../components/modals/TransactionModal'
import { dateFormat } from '../../utils/DateFormat'
import { fetchCurrencyRates } from '../../reducers/CurrencyReducer'
const IncomePage = () => {

  const { fetchTransactions, addTransaction, removeTransaction, editTransaction } = useTransaction('incomes')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState(null) // For editing
  const dispatch = useDispatch()

  const incomes = useSelector(state => state.transactionReducer.transactions.incomes)
  const totalAmount = incomes.reduce((total, income) => total += income.income_amount, 0)

  const currencyRate = useSelector(state => state.currencyReducer.currencyUnit)
  
  // const userCurrencyUnit = useSelector(state => state.userReducer.userCurrencyUnit)

  const showModal = () => {
    setInitialData(null); // Clear initial data for adding
    setOpen(true);
  }

  const handleCancel = () => {
    setOpen(false);
    setInitialData(null); // Clear initial data when closing modal
  }

  const handleCreate = async (data) => {
    setConfirmLoading(true);
    try {
      await addTransaction(data);
      setOpen(false);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction.');
    } finally {
      setConfirmLoading(false);
    }
  }

  const handleDelete = (id) => {
    removeTransaction(id);
  }

  const handleEdit = (data) => {
    setInitialData(data); // Set data to edit
    setOpen(true);
  }

  const handleSaveEdit = (data, id) => {
    setConfirmLoading(true);
    try {
      editTransaction(data, id);
      setOpen(false);
    } catch (error) {
      console.error('Failed to edit transaction:', error);
      alert('Failed to edit transaction.');
    } finally {
      setConfirmLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    // if (currencyRate !== userCurrencyUnit) { // different from user_currency_unit
      fetchCurrencyRates(dispatch)
    // }
  }, [currencyRate, dispatch])

  return (
    <IncomePageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <div className="income-total">
            <p>${(totalAmount * currencyRate).toFixed(2)}</p>
              <h2>Total Income</h2>
            </div>
            <div className="btn-con">
              <button className="btn btn-warning" onClick={showModal}>Add Entry</button>
            </div>
            <TransactionModal
              type="income"
              open={open}
              onCreate={handleCreate}
              onEdit={handleSaveEdit}
              onCancel={handleCancel}
              initialData={initialData}
            />
            <hr />
            <div className="income-content">
              <table className='table'>
                <thead>
                  <tr>
                    <th><span>Date & Time</span></th>
                    <th><span>Income type</span></th>
                    <th><span>Amount</span></th>
                    <th><span>Note</span></th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((income) => (
                    <tr key={income.income_id}>
                      <td><span>{dateFormat(income.income_created_at)}</span></td>
                      <td><span>{income.income_type_id}</span></td>
                      <td><span>{(income.income_amount * currencyRate).toFixed(2)}</span></td>
                      <td><span>{income.income_note}</span></td>
                      <td><span className='edit-btn' onClick={() => handleEdit(income)}>Edit</span></td>
                      <td><span className='del-btn' onClick={() => handleDelete(income.income_id)}>Delete</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </InnerLayout>
    </IncomePageStyled>
  )
}

export default IncomePage


const IncomePageStyled = styled.div`
  p {
    font-weight: 500;
  }
  button {
    border-radius: 20px;
    padding: 0.5rem 1rem;
  }
  span {
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }
  .btn-con {
    margin: 2rem 0;
  }
  .table, th, td {
    --bs-table-bg: transparent;
    border: none;
    thead {
      span {
        font-weight: 600;
        color: white
      }
    }
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn);
  }
`
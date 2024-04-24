import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../styles/Layouts';
import { http } from '../utils/Config';
import { useDispatch, useSelector } from 'react-redux'
import useTransaction from '../customHooks/TransactionHook';
import TransactionModal from '../components/modals/TransactionModal';

const IncomePage = () => {

  const { fetchTransactions, addTransaction, removeTransaction } = useTransaction('incomes')
  const dispatch = useDispatch()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [open, setOpen] = useState(false);

  const incomes = useSelector(state => state.transactionReducer.transactions.incomes);
  console.log(incomes)

  const showModal = () => setOpen(true)

  const handleCancel = () => setOpen(false)

  const handleCreate = async (formData) => {
    setConfirmLoading(true)
    try {
      await addTransaction(formData)
      setOpen(false)
    } catch (error) {
      console.error('Failed to add transaction:', error);
      alert('Failed to add transaction.');
    } finally {
      setConfirmLoading(false);
    }
  }

  const handleDelete = (incomeId) => removeTransaction(incomeId)

  useEffect(() => {
    fetchTransactions()
  }, []); // Don't forget to add dispatch to the dependency array
  
  return (
    <IncomePageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <div className="income-total">
              <p>$100</p>
              <h2>Total Income</h2>
            </div>
            <div className="btn-con">
              <button className="btn btn-warning" onClick={showModal}>Add Entry</button>
            </div>
            <TransactionModal
              type="income"
              open={open}
              onCreate={handleCreate}
              onCancel={handleCancel}
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
                      <td><span>{income.income_created_at}</span></td>
                      <td><span>{income.income_type_id}</span></td>
                      <td><span>{income.income_amount}</span></td>
                      <td><span>{income.income_note}</span></td>
                      <td><span className='edit-btn'>Edit</span></td>
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
        color: white;
      }
    }
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn); 
  }
`;

export default IncomePage
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import useTransaction from '../../customHooks/TransactionHook';
import { useSelector } from 'react-redux';
import TransactionModal from '../../components/modals/TransactionModal';
import { dateFormat } from '../../utils/format/DateFormat';

const SavingPage = () => {

  const [amount, setAmount] = useState("100")

  const { fetchTransactions, addTransaction, removeTransaction, editTransaction } = useTransaction('savings')
  const [confirmLoading, setConfirmLoading] = useState(false) // loading
  const [open, setOpen] = useState(false) // open modal
  const [initialData, setInitialData] = useState(null) // table data for editing modal

  const savings = useSelector(state => state.transactionReducer.transactions.savings)
  console.log(savings)
  const totalAmount = savings.reduce((total, saving) => {
    // Ensure income_amount is a number, defaulting to 0 if it's not
    const amount = parseFloat(saving.saving_amount) || 0;
    return total + amount;
  }, 0)

  const showModal = () => {
    setInitialData(null); // Clear initial data for adding
    setOpen(true);
  }

  const handleCancel = () => {
    setOpen(false);
    setInitialData(null); // Clear initial data when closing modal
  }

  const handleCreate = async (formData) => {
    setConfirmLoading(true);
    try {
      await addTransaction(formData);
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
    fetchTransactions();
  }, [])

  return (
    <SavingPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <div className="income-total">
              <p>$ {totalAmount}</p>
              <h2>Savings Balance</h2>
            </div>
            <div className="btn-con">
              <button className="btn btn-dark mx-3">Export</button>
              <button className="btn btn-warning" onClick={showModal}>Add Entry</button>
            </div>
            <TransactionModal
              type="saving"
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
                    <th><span>Saving type</span></th>
                    <th><span>Amount</span></th>
                    <th><span>Note</span></th>
                  </tr> 
                </thead>
                <tbody>
                  {savings.map((saving) => (
                    <tr key={saving.saving_id}>
                      <td><span>{dateFormat(saving.saving_created_at)}</span></td>
                      <td><span>{saving.saving_type_id}</span></td>
                      <td><span>{saving.saving_amount}</span></td>
                      <td><span>{saving.saving_note}</span></td>
                      <td><span className='edit-btn' onClick={() => handleEdit(saving)}>Edit</span></td>
                      <td><span className='del-btn' onClick={() => handleDelete(saving.saving_id)}>Delete</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </InnerLayout>
    </SavingPageStyled>
  )
}

const SavingPageStyled = styled.div`
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


export default SavingPage


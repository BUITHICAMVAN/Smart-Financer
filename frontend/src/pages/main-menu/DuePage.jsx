import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Tooltip } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons'
import styled from "styled-components"
import { InnerLayout } from "../../styles/Layouts"
import { dateFormat } from "../../utils/format/DateFormat"
import { addDueActionAsync, deleteDueActionAsync, editDueActionAsync, getDuesActionAsync, selectTotalPayableAmount, selectTotalReceivableAmount } from "../../reducers/DueReducer"
import DueModal from "../../components/modals/DueModal"
import { getCurrencySymbol } from "../../utils/format/CurrencySymbol"
import { getDueDateStatus, getDueStatusIcon, getDueTypeWithColor } from "../../utils/DueUtils"

const DuePage = () => {
  const dispatch = useDispatch()

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [initialData, setInitialData] = useState(null) // For editing
  const [dueType, setDueType] = useState('') // For setting due type

  const totalReceivableAmount = useSelector(selectTotalReceivableAmount)

  const totalPayableAmount = useSelector(selectTotalPayableAmount)

  const dues = useSelector(state => state.dueReducer.dues)

  const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit)

  useEffect(() => {
    dispatch(getDuesActionAsync())
  }, [dispatch])

  const handleAddDue = (newDue) => {
    dispatch(addDueActionAsync({ ...newDue, due_type: dueType }))
  }

  const handlePayStatus = () => {

  }

  const handleEditDue = (id, updatedDue) => {
    dispatch(editDueActionAsync(id, updatedDue))
  }

  const handleDeleteDue = (id) => {
    dispatch(deleteDueActionAsync(id))
  }

  const showModal = (type) => {
    setInitialData(null) // Clear initial data for adding
    setDueType(type) // Set the due type
    setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
    setInitialData(null) // Clear initial data when closing modal
  }

  const handleCreate = async (data) => {
    setConfirmLoading(true)
    try {
      await dispatch(addDueActionAsync(data))
      setOpen(false)
    } catch (error) {
      console.error('Failed to add transaction:', error)
      alert('Failed to add transaction.')
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleDelete = (id) => {
    dispatch(deleteDueActionAsync(id))
  }

  const handleEdit = (data) => {
    setInitialData(data) // Set data to edit
    setOpen(true)
  }

  const handleSaveEdit = (id, data) => {
    setConfirmLoading(true)
    try {
      dispatch(editDueActionAsync(id, data))
      setOpen(false)
    } catch (error) {
      console.error('Failed to edit transaction:', error)
      alert('Failed to edit transaction.')
    } finally {
      setConfirmLoading(false)
    }
  }

  useEffect(() => {
    dispatch(getDuesActionAsync())
  }, [])

  return (
    <DuePageStyled>
      <InnerLayout>
        <div className="tooltip-container">
          <Tooltip
            title={
              <div>
                <p><strong>Dues</strong></p>
                <p>1. Keep track of your pending dues and mark them as paid when cleared.</p>
                <p>2. Once marked as paid, it will be reflected in the account you choose.</p>
              </div>
            }
          >
            <QuestionCircleOutlined className="tooltip-icon" />
          </Tooltip>
        </div>
        <div className="container content-container">
          <div className="due-amount text-center">
            <div className="due-payable">
              <p>{getCurrencySymbol(currentUnit)} {totalReceivableAmount}</p>
              <h2>Due Payable</h2>
            </div>
            <div className="due-receivable">
              <p>{getCurrencySymbol(currentUnit)} {totalPayableAmount}</p>
              <h2>Due Receivable</h2>
            </div>
          </div>
          <div className="due-modal text-center">
            <div className="btn-con">
              <button className="btn btn-warning" onClick={() => showModal(2)}>Due Payable</button>
            </div>
            <div className="btn-con">
              <button className="btn btn-dark" onClick={() => showModal(1)}>Due Receivable</button>
            </div>
          </div>
          <DueModal
            type="due"
            open={open}
            dueType={dueType} // Pass the dueType to the modal
            onCreate={handleCreate}
            onEdit={handleSaveEdit}
            onCancel={handleCancel}
            initialData={initialData}
          />
          <hr />
          <div className="due-content  text-center">
            <table className='table'>
              <thead>
                <tr>
                  <th><span>Date & Time</span></th>
                  <th><span>Details</span></th>
                  <th><span>Amount</span></th>
                  <th><span>Type</span></th>
                  <th><span>Status</span></th>
                  <th><span>Due Date</span></th>
                </tr>
              </thead>
              <tbody>
                {dues.map((due) => (
                  <tr key={due.due_id}>
                    <td><span>{dateFormat(due.due_created_at)}</span></td>
                    <td><span>{due.due_details}</span></td>
                    <td><span>{getCurrencySymbol(currentUnit)}{due.due_amount}</span></td>
                    <td><span>{getDueTypeWithColor(due.due_type_id, due)}</span></td>
                    <td><span>{getDueStatusIcon(due.due_status_id, due)}</span></td>
                    <td><span>{dateFormat(due.due_due_date)} {getDueDateStatus(due.due_due_date)}</span></td>
                    <td><span className="mark-btn" onClick={() => { handlePayStatus(due) }}>Mark as paid</span></td>
                    <td><span className='edit-btn' onClick={() => handleEdit(due)}>Edit</span></td>
                    <td><span className='del-btn' onClick={() => handleDelete(due.due_id)}>Delete</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </InnerLayout>
    </DuePageStyled>
  )
}

export default DuePage


const DuePageStyled = styled.div`
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

  .due-page-card {
    background-color: #1e1e1e;
    color: #ffffff;
  }

  .tooltip-container {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }

  .tooltip-icon {
    font-size: 16px;
    color: #8c8c8c;
  }

  .amount-summary {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 1rem;
  }

  .amount-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .amount-text {
    font-size: 2rem;
    color: #ffffff;
  }

  .amount-text-negative {
    color: #ff4d4f;
  }

  .amount-label {
    font-size: 0.875rem;
    color: #8c8c8c;
    text-align: center;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
  }

  .ant-card {
    background-color: #1e1e1e;
  }

  .ant-card-bordered, .ant-card-head-title, .ant-card-body {
    color: #ffffff;
  }

  .ant-btn-primary {
    background-color: #52c41a;
    border-color: #52c41a;
  }

  .ant-btn-link {
    color: #ffffff;
  }

  .ant-divider-horizontal {
    border-top: 1px solid #ffffff;
  }

  .ant-table {
    background-color: #1e1e1e;
  }

  .ant-table-thead > tr > th {
    background-color: #1e1e1e;
    color: #ffffff;
  }

  .ant-table-tbody > tr > td {
    color: #ffffff;
  }

  .due-amount {
    display: flex;
    flex-direction: row; 
    justify-content: space-around;
  }
  
  .due-modal {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .btn-con {
      padding: 0 1rem;
    }
  }
`;

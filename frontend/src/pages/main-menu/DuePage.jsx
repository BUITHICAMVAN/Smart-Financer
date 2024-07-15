import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { dateFormat } from "../../utils/format/DateFormat";
import {
  addDueActionAsync,
  deleteDueActionAsync,
  editDueActionAsync,
  getDuesActionAsync,
  selectTotalPayableAmount,
  selectTotalReceivableAmount,
  markDueAsPaidActionAsync,
} from "../../reducers/DueReducer";
import DueModal from "../../components/modals/DueModal";
import { getCurrencySymbol } from "../../utils/format/CurrencySymbol";
import {
  getDueDateStatus,
  getDueStatusIcon,
  getDueTypeWithColor,
} from "../../utils/DueUtils";
import PayStatusModal from "../../components/modals/PayStatusModal";
import ReturnButton from "../../components/button/ReturnButton";
import ConfirmModal from "../../components/modals/ConfirmModal";

const DuePage = () => {
  const dispatch = useDispatch();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState(null); // For editing
  const [dueType, setDueType] = useState(""); // For setting due type
  const [payStatusOpen, setPayStatusOpen] = useState(false);
  const [selectedDue, setSelectedDue] = useState(null); // For pay status
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const totalReceivableAmount = useSelector(selectTotalReceivableAmount);
  const totalPayableAmount = useSelector(selectTotalPayableAmount);
  const dues = useSelector((state) => state.dueReducer.dues);
  const currentUnit = useSelector(
    (state) => state.userReducer.userCurrencyUnit
  );

  useEffect(() => {
    dispatch(getDuesActionAsync());
  }, [dispatch]);

  const handlePayStatus = (due) => {
    setSelectedDue(due);
    setPayStatusOpen(true);
  };

  const showModal = (type) => {
    setInitialData(null);
    setDueType(type);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setInitialData(null); // Clear initial data when closing modal
    setDueType(""); // Clear dueType when closing modal
  };

  const handleCreate = async (data) => {
    setConfirmMessage("Are you sure to add this transaction?");
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(addDueActionAsync(data));
        setOpen(false);
        setAlertMessage("Your entry has been added successfully.");
      } catch (error) {
        console.error("Failed to add transaction:", error);
        setAlertMessage("Failed to add transaction.");
      } finally {
        setAlertVisible(true);
      }
    });
  };

  const handleDelete = async (id) => {
    setConfirmMessage("Are you absolutely sure? This action cannot be undone. This will permanently delete this entry from your dues.");
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(deleteDueActionAsync(id));
        setAlertMessage("Your entry has been deleted successfully.");
      } catch (error) {
        console.error("Failed to delete transaction:", error);
        setAlertMessage("Failed to delete transaction.");
      } finally {
        setAlertVisible(true);
      }
    });
  };

  const handleEdit = (data) => {
    setInitialData(data); // Set data to edit
    setDueType(data.due_type_id); // Set due type when editing
    setOpen(true);
  };

  const handleSaveEdit = async (id, data) => {
    setConfirmMessage("Are you sure to edit this transaction?");
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(editDueActionAsync(id, data));
        setOpen(false);
        setAlertMessage("Your entry has been edited successfully.");
      } catch (error) {
        console.error("Failed to edit transaction:", error);
        setAlertMessage("Failed to edit transaction.");
      } finally {
        setAlertVisible(true);
      }
    });
  };

  const handleMarkAsPaid = (values) => {
    console.log("Marked as paid with:", values);
    setPayStatusOpen(false);
  };

  useEffect(() => {
    dispatch(getDuesActionAsync());
  }, [dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dues.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(dues.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <Pagination>
        {pageNumbers.map((number) => (
          <PaginationItem
            key={number}
            onClick={() => handlePageChange(number)}
            active={number === currentPage}
          >
            {number}
          </PaginationItem>
        ))}
      </Pagination>
    );
  };

  const getPaymentType = (due) => {
    // Determine payment type based on due_type_id or any other logic
    if (due.due_type_id === 1) {
      return "receivable";
    } else if (due.due_type_id === 2) {
      return "payable";
    }
    return "";
  };

  return (
    <DuePageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container">
            <ReturnButton />
            <Tooltip
              title={
                <div className="tooltip-content">
                  <p>
                    <strong>Dues</strong>
                  </p>
                  <p>
                    1. Keep track of your pending dues and mark them as paid
                    when cleared.
                  </p>
                  <p>
                    2. Once marked as paid, it will be reflected in the account
                    you choose.
                  </p>
                </div>
              }
            >
              <QuestionCircleOutlined className="tooltip-icon" />
            </Tooltip>
            <div className="due-amount text-center">
              <div className="due-payable">
                <p>
                  {getCurrencySymbol(currentUnit)} {totalReceivableAmount}
                </p>
                <h2>Due Payable</h2>
              </div>
              <div className="due-receivable">
                <p>
                  {getCurrencySymbol(currentUnit)} {totalPayableAmount}
                </p>
                <h2>Due Receivable</h2>
              </div>
            </div>
            <div className="due-modal text-center">
              <div className="btn-con">
                <button
                  className="btn btn-warning"
                  onClick={() => showModal(2)}
                >
                  Due Payable
                </button>
              </div>
              <div className="btn-con">
                <button className="btn btn-dark" onClick={() => showModal(1)}>
                  Due Receivable
                </button>
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
            <PayStatusModal
              open={payStatusOpen}
              onMarkAsPaid={handleMarkAsPaid}
              onCancel={() => setPayStatusOpen(false)}
              paymentType={selectedDue ? getPaymentType(selectedDue) : ""}
            />
            <hr />
            <div className="due-content text-center">
              <table className="table">
                <thead>
                  <tr>
                    <th className="date-time">
                      <span>Date & Time</span>
                    </th>
                    <th className="detail">
                      <span>Details</span>
                    </th>
                    <th className="amount">
                      <span>Amount</span>
                    </th>
                    <th className="type">
                      <span>Type</span>
                    </th>
                    <th className="status">
                      <span>Status</span>
                    </th>
                    <th className="due">
                      <span>Due Date</span>
                    </th>
                  </tr>
                </thead>
                {currentItems.length === 0 ? (
                  <div className="no-entries">
                    <p>No entries added yet.<br />Add your first entry of the month!</p>
                  </div>
                ) : (
                  <tbody>
                    {currentItems.map((due) => (
                      <tr key={due.due_id}>
                        <td className="date-time">
                          <span className="white-text">{dateFormat(due.due_created_at)}</span>
                        </td>
                        <td className="detail">
                          <span className="white-text">{due.due_details}</span>
                        </td>
                        <td className="amount">
                          <span className="white-text">
                            {getCurrencySymbol(currentUnit)}
                            {due.due_amount}
                          </span>
                        </td>
                        <span className="hr-type"></span>
                        <td className="type">
                          <span className="white-text">{getDueTypeWithColor(due.due_type_id, due)}</span>
                        </td>
                        <td className="status">
                          <span className="white-text">{getDueStatusIcon(due.due_status_id, due)}</span>
                        </td>
                        <td className="due">
                          <span className="white-text">
                            {dateFormat(due.due_due_date)}{" "}
                            {getDueDateStatus(due.due_due_date)}
                          </span>
                        </td>
                        <td className="mark-status">
                          <span
                            className="mark-btn"
                            onClick={() => {
                              handlePayStatus(due);
                            }}
                          >
                            Mark as paid
                          </span>
                        </td>
                        <td className="action edit-action">
                          <span
                            className="edit-btn"
                            onClick={() => handleEdit(due)}
                          >
                            Edit
                          </span>
                        </td>
                        <td className="action delete-action">
                          <span
                            className="del-btn"
                            onClick={() => handleDelete(due.due_id)}
                          >
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
              {renderPagination()}
            </div>
          </div>
        </div>
      </InnerLayout>
      <ConfirmModal
        title="Confirm"
        visible={confirmVisible}
        onConfirm={() => {
          confirmAction();
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
        confirmLoading={confirmLoading}
        content={confirmMessage}
      />
      <ConfirmModal
        visible={alertVisible}
        onConfirm={() => setAlertVisible(false)}
        onCancel={() => setAlertVisible(false)}
        confirmLoading={false}
        content={alertMessage}
        type="alert"
      />
    </DuePageStyled>
  );
};

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
  .white-text {
    color: white;
    font-weight: 400;
  }
  .btn-con {
    margin: 2rem 0;
    button {
      border-radius: 20px;
      padding: 0.5rem 1rem;
    }
  }
  .table {
    .no-entries {
      p {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          Liberation Mono, Courier New, monospace;
        color: grey;
        padding-top: 1rem;
        font-size: 1rem;
        font-weight: 400;
      }
    }
  }
  .table,
  th,
  td {
    --bs-table-bg: transparent;
    border: none;
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
      margin-bottom: 2.5rem;
      td {
        border: none;
        padding: 0.5rem;
      }
      &:hover td {
        background: var(--hover-color);
      }
    }
  }
  .edit-btn,
  .del-btn {
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

  .due-modal .btn-con {
    padding: 0 1rem;
  }
  .due-modal button {
    border-radius: 20px;
    padding: 0.5rem 1rem;
  }
  .mark-status {
    span:hover {
      background: var(--color-yellow);
    }
  }
  @media screen and (max-width: 1280px) {
    .tooltip-icon {
      display: none;
    }
    table {
      border-collapse: collapse;
    }
    thead {
      tr {
        display: block;
      }
      th {
        display: inline-block;
        width: 50%;
      }
      .date-time,
      .action,
      .type,
      .status,
      .due {
        display: none;
      }
    }
    tbody {
      span {
        color: white;
        font-size: 0.75rem;
        line-height: 1.25rem;
        font-weight: 400;
      }
      tr {
        display: block;
        height: 9.5rem;
      }
      .detail,
      .amount {
        display: inline-block;
        width: 50%;
      }
      .date-time {
        display: none;
      }
      .type,
      .due,
      .mark-status,
      .action,
      .status {
        position: absolute;
      }
      .type {
        top: 2.5rem;
        left: 2rem;
        span {
          font-weight: 600;
        }
      }
      .mark-status {
        top: 2.5rem;
        right: 1rem;
        span {
          background-color: #92919036;
          padding: 0.3rem;
        }
      }
      .due {
        top: 4.5rem;
        left: 2rem;
      }
      .action {
        top: 6.5rem;
        left: 2rem;
        span {
          font-weight: 500;
        }
      }
      .delete-action {
        left: 4.5rem;
      }
      .status {
        top: 6.5rem;
        right: 10px;
        align-self: flex-end;
        border-radius: 5px;
        color: white;
      }
      .edit-action,
      .delete-action {
        width: auto;
        display: inline-block;
      }
      .hr-type:before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 1px;
        background: #dddddd58;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .due-modal {
      display: block;
      .btn-con {
        margin: 1rem 0;
      }
      button {
        font-size: 0.8rem;
        line-height: 1.25rem;
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
  color: ${({ active }) => (active ? "#fff" : "#fff")};
  background-color: ${({ active }) =>
    active ? "var(--color-yellow)" : "transparent"};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.75rem;
  &:hover {
    background-color: ${({ active }) =>
    active ? "var(--color-yellow)" : "#f0f0f0"};
  }
`;

export default DuePage;

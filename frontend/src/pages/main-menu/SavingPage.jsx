import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import useTransaction from "../../customHooks/TransactionHook";
import { useDispatch, useSelector } from "react-redux";
import TransactionModal from "../../components/modals/TransactionModal";
import { dateFormat } from "../../utils/format/DateFormat";
import { calculateTotalAmount } from "../../utils/calculate/totalAmount";
import { getCurrencySymbol } from "../../utils/format/CurrencySymbol";
import { setCurrentCurrencyAsync } from "../../reducers/UserReducer";
import ReturnButton from "../../components/button/ReturnButton";
import ConfirmModal from "../../components/modals/ConfirmModal";

const SavingPage = () => {
  const dispatch = useDispatch();
  const {
    fetchMonthlyTransaction,
    addTransaction,
    removeTransaction,
    editTransaction,
  } = useTransaction("savings");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState(null); // For editing
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);


  const currentMonthTransactions = useSelector(
    (state) => state.transactionReducer.currentMonthTransactions
  );
  const savings = currentMonthTransactions.savings || [];
  const savingTypes = useSelector(
    (state) => state.transactionTypeReducer.transactionTypes.savingTypes
  );

  const totalAmount = calculateTotalAmount(savings, "saving_amount");
  const currentUnit = useSelector(
    (state) => state.userReducer.userCurrencyUnit
  );

  const showModal = () => {
    setInitialData(null); // Clear initial data for adding
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setInitialData(null); // Clear initial data when closing modal
  };

  const handleCreate = async (data) => {
    setConfirmMessage("Are you sure to add this transaction")
    setConfirmVisible(true)
    setConfirmAction(() => async () => {
      try {
        await addTransaction(data)
        await fetchMonthlyTransaction()
        setOpen(false)
        await setAlertMessage("Your entry has been added succesfully.")
      } catch (error) {
        console.error("Failed to add transaction:", error)
        setAlertMessage("Failed to add transaction.")
      } finally {
        setAlertVisible(true)
      }
    });
  };

  const handleDelete = async (id) => {
    setConfirmMessage("Are you absolutely sure? This action cannot be undone. This will permanently delete this entry from your income.")
    setConfirmVisible(true)
    setConfirmAction(() => async () => {
      try {
        await removeTransaction(id)
        await fetchMonthlyTransaction()
        setAlertMessage("Your entry has been deleted successfully.")
      } catch (error) {
        console.error("Failed to delete transaction:", error)
        setAlertMessage("Failed to delete transaction.")
      } finally {
        setAlertVisible(true);
      }
    });
  };


  const handleEdit = (data) => {
    setInitialData(data); // Set data to edit
    setOpen(true);
  };

  const handleSaveEdit = async (data, id) => {
    setConfirmMessage("Are you sure to edit this transaction?");
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await editTransaction(data, id)
        setOpen(false)
        await fetchMonthlyTransaction()
        setAlertMessage("Your entry has been edited succesfully.")
      } catch (error) {
        console.error("Failed to edit transaction:", error)
        setAlertMessage("Failed to edit transaction.")
      } finally {
        setAlertVisible(true)
      }
    });
  };
  const getSavingTypeName = (id) => {
    const savingType = savingTypes.find((type) => type.saving_type_id === id);
    return savingType ? savingType.saving_type_name : "others";
  };

  useEffect(() => {
    fetchMonthlyTransaction();
  }, []);

  useEffect(() => {
    dispatch(setCurrentCurrencyAsync());
  }, [dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = savings.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  );

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(savings.length / itemsPerPage); i++) {
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

  return (
    <SavingPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <ReturnButton />
            <div className="income-total">
              <p>
                {getCurrencySymbol(currentUnit)}
                {totalAmount}
              </p>
              <h2>Savings Balance</h2>
            </div>
            <div className="btn-con">
              <button className="btn btn-warning" onClick={showModal}>
                Add Entry
              </button>
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
                    <th className="note">
                      <span>Note</span>
                    </th>
                  </tr>
                </thead>
                {currentItems.length === 0 ? (
                  <div className="no-entries">
                    <p>No entries added yet.<br />Add your first entry of the month!</p>
                  </div>
                ) : (
                  <tbody>
                    {currentItems.map((saving) => (
                      <tr key={saving.saving_id}>
                        <td className="date-time">
                          <span className="white-text">
                            {dateFormat(saving.saving_created_at)}
                          </span>
                        </td>
                        <td className="detail">
                          <span className="white-text">
                            {getSavingTypeName(saving.saving_type_id)}
                          </span>
                        </td>
                        <td className="amount">
                          <span className="white-text">
                            {getCurrencySymbol(currentUnit)}
                            {saving.saving_amount}
                          </span>
                        </td>
                        <td className="note">
                          <span className="white-text">{saving.saving_note}</span>
                        </td>
                        <td className="action edit-action">
                          <span
                            className="edit-btn"
                            onClick={() => handleEdit(saving)}
                          >
                            Edit
                          </span>
                        </td>
                        <td className="action delete-action">
                          <span
                            className="del-btn"
                            onClick={() => handleDelete(saving.saving_id)}
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
    </SavingPageStyled>
  );
};

const SavingPageStyled = styled.div`
  p {
    font-weight: 500;
  }
  span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
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
    text-align: center;
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
  }
  .white-text {
    color: white;
    font-weight: 400;
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

    @media screen and (max-width: 1280px) {
      .btn-con {
        button {
          font-size: 0.7rem;
        }
      }
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
          width: 33.3%;
        }
        .date-time,
        .action {
          display: none;
        }
      }
      tbody {
        span {
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 400;
        }
        tr {
          display: block;
        }
        .detail,
        .amount,
        .note {
          display: inline-block;
          width: 33.3%;
        }
        .date-time {
          position: absolute;
          top: 74px;
          right: 25px;
          align-self: flex-end;
          border-radius: 5px;
          color: white;
          span {
            font-size: 10px;
            background-color: #444;
            padding: 0.5rem 0.5rem;
            border-end-end-radius: 10px;
            border-bottom-left-radius: 10px;
          }
        }
        .action {
          display: inline-block;
          width: 100%;
        }
        .edit-action,
        .delete-action {
          width: auto;
          display: inline-block;
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

export default SavingPage;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import ExpenseModal from "../../components/modals/ExpenseModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpenseActionAsync,
  deleteExpenseActionAsync,
  editExpenseActionAsync,
  fetchCurrentMonthExpensesAsync,
} from "../../reducers/ExpenseReducer";
import { dateFormat } from "../../utils/format/DateFormat";
import { getCurrencySymbol } from "../../utils/format/CurrencySymbol";
import useTransaction from "../../customHooks/TransactionHook";
import { getCurrentMonth } from "../../utils/CurrentDate";
import { setCurrentCurrencyAsync } from "../../reducers/UserReducer";
import { getExpenseTypeName } from "../../utils/mapping/ExpenseTypeMapping";
import { getExpenseTypesActionAsync } from "../../reducers/ExpenseTypeReducer";
import ReturnButton from "../../components/button/ReturnButton";
import ConfirmModal from "../../components/modals/ConfirmModal";

const ExpensePage = () => {
  const dispatch = useDispatch();
  const { fetchCurrentMonthSaving } = useTransaction("savings");

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

  const expenses = useSelector(
    (state) => state.expenseReducer.currentMonthExpenses
  );
  const expenseTypes = useSelector(
    (state) => state.expenseTypeReducer.expenseTypes
  );

  const needs = expenses.filter(
    (expense) =>
      expense.ExpenseType.ExpenseCategory.expense_category_name === "essentials"
  );
  const wants = expenses.filter(
    (expense) =>
      expense.ExpenseType.ExpenseCategory.expense_category_name ===
      "non-essentials"
  );

  const totalNeedsAmount = needs.reduce((total, expense) => {
    const amount = parseFloat(expense.expense_amount) || 0;
    return total + amount;
  }, 0);

  const totalWantsAmount = wants.reduce((total, expense) => {
    const amount = parseFloat(expense.expense_amount) || 0;
    return total + amount;
  }, 0);

  const currentUnit = useSelector(
    (state) => state.userReducer.userCurrencyUnit
  );
  const currentMonth = getCurrentMonth();
  const currentMonthSaving = useSelector(
    (state) => state.transactionReducer.currentMonthSaving
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
    setConfirmMessage("Are you sure to add this transaction");
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(addExpenseActionAsync(data));
        await dispatch(fetchCurrentMonthExpensesAsync());
        setOpen(false);
        await setAlertMessage("Your entry has been added succesfully.");
      } catch (error) {
        console.error("Failed to add transaction:", error);
        setAlertMessage("Failed to add transaction.");
      } finally {
        setAlertVisible(true);
      }
    });
  };

  const handleDelete = async (id) => {
    setConfirmMessage(
      "Are you absolutely sure? This action cannot be undone. This will permanently delete this entry from your income."
    );
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(deleteExpenseActionAsync(id));
        await dispatch(fetchCurrentMonthExpensesAsync());
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
    setOpen(true);
  };

  const handleSaveEdit = async (id, data) => {
    setConfirmMessage("Are you sure to edit this transaction?");
    setConfirmVisible(true);
    setConfirmAction(() => async () => {
      try {
        await dispatch(editExpenseActionAsync(id, data));
        setOpen(false);
        await dispatch(fetchCurrentMonthExpensesAsync());
        setAlertMessage("Your entry has been edited succesfully.");
      } catch (error) {
        console.error("Failed to edit transaction:", error);
        setAlertMessage("Failed to edit transaction.");
      } finally {
        setAlertVisible(true);
      }
    });
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
    <ExpensePageStyled>
      <InnerLayout>
        <div className="container">
          <div className="expense-container">
            <div className="content-container content-left text-center">
              <ReturnButton />
              <h1> {currentMonth} Entries</h1>
              <hr />
              <div className="expense-content">
                <div className="btn-con">
                  <button className="btn btn-warning" onClick={showModal}>
                    Add Entry
                  </button>
                </div>
                <ExpenseModal
                  open={open}
                  onCreate={handleCreate}
                  onEdit={handleSaveEdit}
                  onCancel={handleCancel}
                  initialData={initialData}
                />
                <table className="table">
                  <thead>
                    <tr>
                      <th className="date-time">
                        <span>Date & Time</span>
                      </th>
                      <th className="detail">
                        <span>Details</span>
                      </th>
                      <th className="need">
                        <span>Needs</span>
                      </th>
                      <th className="want">
                        <span>Wants</span>
                      </th>
                    </tr>
                  </thead>
                  {expenses.length === 0 ? (
                    <div className="no-entries">
                      <p>No entries added yet.<br />Add your first entry of the month!</p>
                    </div>
                  ) : (
                    <tbody>
                      {currentItems.map((expense) => (
                        <tr key={expense.expense_id}>
                          <td className="date-time">
                            <span className="white-text">
                              {dateFormat(expense.expense_created_at)}
                            </span>
                          </td>
                          <td className="detail">
                            <span className="white-text">
                              {getExpenseTypeName(
                                expense.expense_type_id,
                                expenseTypes
                              )}
                            </span>
                          </td>
                          <td className="need">
                            <span
                              className={
                                expense.ExpenseType.ExpenseCategory
                                  .expense_category_name === "essentials"
                                  ? "white-text"
                                  : "na-text"
                              }
                            >
                              {expense.ExpenseType.ExpenseCategory
                                .expense_category_name === "essentials"
                                ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount
                                }`
                                : "N/A"}
                            </span>
                          </td>
                          <td className="want">
                            <span
                              className={
                                expense.ExpenseType.ExpenseCategory
                                  .expense_category_name === "non-essentials"
                                  ? "white-text"
                                  : "na-text"
                              }
                            >
                              {expense.ExpenseType.ExpenseCategory
                                .expense_category_name === "non-essentials"
                                ? `${getCurrencySymbol(currentUnit)}${expense.expense_amount
                                }`
                                : "N/A"}
                            </span>
                          </td>
                          <td className="action edit-action">
                            <span
                              className="edit-btn"
                              onClick={() => handleEdit(expense)}
                            >
                              Edit
                            </span>
                          </td>
                          <td className="action delete-action">
                            <span
                              className="del-btn"
                              onClick={() => handleDelete(expense.expense_id)}
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
            <div className="content-container content-right text-left">
              <h1 className="text-center">Expense Insights</h1>
              <hr />
              <div className="insight">
                <div className="spending">
                  <span className="insight-title">Spendings</span>
                  <div className="main">
                    <div className="amount">
                      <p>
                        Needs: {getCurrencySymbol(currentUnit)}
                        {totalNeedsAmount}
                      </p>
                      <p>
                        Wants: {getCurrencySymbol(currentUnit)}
                        {totalWantsAmount}
                      </p>
                    </div>
                    <div className="bracket">
                      <p>{"}"}</p>
                      <p>
                        {getCurrencySymbol(currentUnit)}
                        {totalNeedsAmount + totalWantsAmount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="money-left">
                  <span className="insight-title">Money Left</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: {getCurrencySymbol(currentUnit)}</p>
                      <p>Wants: {getCurrencySymbol(currentUnit)}</p>
                    </div>
                    <div className="bracket">
                      <p>{"}"}</p>
                      <p>
                        {getCurrencySymbol(currentUnit)}
                        {currentMonthSaving}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="saving">
                  <span className="insight-title">Savings</span>
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
  span {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
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
      text-align: center;
    }
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
  .na-text {
    font-size: 0.7em;
    color: gray;
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
  @media screen and (max-width: 1280px) {
    .btn-con {
      button {
        font-size: 0.8rem;
      }
    }
    .expense-container {
      display: flex;
      flex-direction: column;
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
      span {
        color: white;
      }
    }
    tbody {
      span {
        font-size: 0.8rem;
        line-height: 1.25rem;
        font-weight: 400;
      }
      tr {
        display: block;
      }
      .detail,
      .need,
      .want {
        display: inline-block;
        width: 33.3%;
      }
      .date-time {
        position: absolute;
        top: 70px;
        right: 20px;
        align-self: flex-end;
        border-radius: 5px;
        span {
          font-size: 10px;
          background-color: #444;
          padding: 0.25rem 0.5rem;
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
      span {
        color: white;
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

export default ExpensePage;

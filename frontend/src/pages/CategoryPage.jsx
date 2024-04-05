import React, { useState } from "react";
import { InnerLayout } from "../styles/Layouts";
import styled from "styled-components";
import { useFormik } from "formik";
import CategoryTable from "../components/tables/CategoryTable";
import { Button } from "antd";
import * as yup from 'yup';

const CategoryPage = () => {
  const [showCustomRatio, setShowCustomRatio] = useState(false);
  const handleRadioChange = (event) => {
    setShowCustomRatio(event.target.value === "custom");
  };

  const [count, setCount] = useState(2);

  const categoryForm = useFormik({
    initialValues: {
      currency: "VND",
      expectedIncome: "",
      customRatio: {
        needRatio: '',
        savingRatio: '',
        wantRatio: ''
      },
      incomeType: [
        { type: "freelance" }
      ],
      expenseType: {
        needs: [{ type: "rent" }],
        wants: [{ type: "shoes" }],
      },
      savingType: [{ type: "car" }],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "VND":
        return "₫";
      default:
        return "";
    }
  };

  const incomeColumns = [
    {
      title: "Income",
      dataIndex: "income",
      key: "income",
      children: [
        {
          title: "",
          dataIndex: "type",
          key: "type",
        },
      ],
    },
  ];

  const savingColumns = [
    {
      title: "Saving",
      dataIndex: "saving",
      key: "saving",
      children: [
        {
          title: "",
          dataIndex: "type",
          key: "type",
        },
      ],
    },
  ];

  const expenseColumns = [
    {
      title: "Expenses",
      dataIndex: "expenses",
      key: "expenses",
      children: [
        {
          title: "Needs",
          dataIndex: "needs",
          key: "needs",
        },
        {
          title: "Wants",
          dataIndex: "wants",
          key: "wants",
        },
      ],
    },
  ];

  return (
    <CategoryStyle>
      <InnerLayout>
        <div className="container content-container">
          <form
            onSubmit={categoryForm.handleSubmit}
            className="category-container category-form"
          >
            <h3>Tailor My Budget</h3>
            <div className="form-group">
              <label htmlFor="currency">Currency <i className="fa-solid fa-money-check-dollar"></i></label>
              <select
                className="form-select form-select-lg border-shadow mb-3"
                id="currency"
                onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur}
              >
                <option selected>Open this select menu</option>
                <option value="USD">USD</option>
                <option value="VND">VND</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="expectedIncome">Expected monthly income</label>
              <div className="input-group input-group-sm border-shadow">
                <span className="input-group-text">{getCurrencySymbol(categoryForm.values.currency)}</span>
                <input
                  type="text"
                  className="form-control"
                  id="expectedIncome"
                  placeholder="Fill in income" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur}
                />
              </div>
            </div>
            <div className="form-group expense-ratio">
              <div className="form-check px-4">
                <input
                  className="form-check-input"
                  type="radio"
                  name="expense-ratio"
                  id="standard-ratio"
                  value="standard"
                  onChange={handleRadioChange}
                />
                <div className="form-check-title">
                  <label className="form-check-label" htmlFor="standard-ratio">
                    50-30-20
                  </label>
                  <span>Continue with the standard ratio.</span>
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="expense-ratio"
                  id="custom-ratio"
                  value="custom"
                  onChange={handleRadioChange}
                />
                <div className="form-check-title">
                  <label className="form-check-label" htmlFor="custom-ratio">
                    Custom
                  </label>
                  <span>Customize my ratio.</span>
                </div>
              </div>
            </div>
            {showCustomRatio && (
              <div className="form-group">
                <div className="custom-ratio border-shadow">
                  <div className="input-group input-group-sm">
                    <label htmlFor="need-ratio">Need ratio</label>
                    <input id="need-ratio" type="text" className="form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="input-group input-group-sm">
                    <label htmlFor="saving-ratio">Saving ratio</label>
                    <input id="saving-ratio" type="text" className="form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="input-group input-group-sm">
                    <label htmlFor="want-ratio">Want ratio</label>
                    <input type="text" className="form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>
            )}
            <hr />
            <div className="form-group category-table">
              <h3 className="text-center">Set up Category</h3>
              <div className="category-content">
                <div className="income-table">
                  <CategoryTable
                    columns={incomeColumns}
                    dataSource={categoryForm.values.incomeType}
                  />
                </div>
                <div className="saving-table">
                  <CategoryTable
                    columns={savingColumns}
                    dataSource={categoryForm.values.savingType}
                    rowClassName={() => 'editable-row'}
                  />
                </div>
                <div className="expense-table">
                  <CategoryTable
                    columns={expenseColumns}
                    dataSource={[
                      {
                        key: "1",
                        expenses: "Expenses",
                        needs: categoryForm.values.expenseType.needs.map(
                          (item) => item.type
                        ),
                        wants: categoryForm.values.expenseType.wants.map(
                          (item) => item.type
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="form-group btn-submit">
              <button type="submit" className="btn btn-warning w-100">
                Save
              </button>
            </div>
          </form>
        </div>
      </InnerLayout>
    </CategoryStyle>
  );
};

const CategoryStyle = styled.div`
  p {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0;
    margin: 0;
  }
  h3 {
    text-align: center;
  }
  .border-shadow {
    border-radius: 10px;
    border: 2px solid #1d1a11;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  }
  input,
  select,
  span {
    background-color: var(--input-color);
    border-radius: 10px;
    border: none;
    color: rgba(113, 113, 122, 1);
  }

  .category-form {
    .form-group {
      margin: 1.6rem 0;
      label {
        margin-bottom: 1rem;
        line-height: 1;
        font-weight: 500;
        font-size: .875rem;
      }
      i {
        font-size: 1rem;
      }
    }
    .form-check-title {
      .form-check-label {
        margin: 0;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
      }
      span {
        background-color: transparent;
        font-size: 0.875rem;
        color: rgba(113, 113, 122, 1);
      }
    }
    .expense-ratio {
      display: flex;
      flex-direction: row;
    }
    .form-select,
    .form-control {
      font-weight: 400;
      font-size: 0.875rem;
      text-align: left;
      color: var(--color-white);
      border: none;
      border-radius: 10px;
      background-color: var(--input-color);
    }
    .form-check-input:checked {
      background-color: var(--color-yellow);
      border-color: var(--color-yellow);
    }
    span {
      font-weight: 400;
      color: white;
    }
    .custom-ratio {
      margin: 0.5rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: var(--select-color);
      padding: 0.5rem;
      .input-group {
        width: 30%;
      }
    }
  }
  .category-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr) repeat(3, 1fr) repeat(6, 1fr);
    gap: 2rem;
    margin: 1.6rem 0;
    .income-table,
    .saving-table,
    .expense-table {
      background-color: var(--select-color);
      padding: 1rem 1.25rem;
      border-radius: 20px;
    }
    .income-table {
      grid-column: span 3;
    }
    .saving-table {
      grid-column: span 3;
    }
    .expense-table {
      grid-column: span 6;
    }
  }
`;

export default CategoryPage;

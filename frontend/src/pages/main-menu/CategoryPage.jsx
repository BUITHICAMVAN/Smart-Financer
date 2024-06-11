import React, { useEffect, useState } from "react"
import { InnerLayout } from "../../styles/Layouts"
import styled from "styled-components"
import { useFormik } from "formik"
import CategoryTable from "../../components/tables/CategoryTable"
import { useDispatch, useSelector } from "react-redux"
import useTransactionType from "../../customHooks/TransactionTypeHook"
import { getCurrencySymbol } from "../../utils/CurrencySymbol"
import { getUserExpectedIncomeAsync, getUserPercentAsync } from "../../reducers/UserReducer"
import { calcMoneyAllocation } from "../../utils/MoneyAllocation"

const CategoryPage = () => {
  const dispatch = useDispatch()

  const [showCustomRatio, setShowCustomRatio] = useState(false)
  const [selectedPercent, setSelectedPercent] = useState('')
  const { fetchTransactionTypes: fetchIncomeTypes } = useTransactionType("income")
  const { fetchTransactionTypes: fetchSavingTypes } = useTransactionType("saving")

  // HANDLE CURRENCY UNI
  const currencyUnit = useSelector(state => state.currencyReducer.currencyUnit)

  // HANDLE EXPECTED MONTHLY INCOME
  const expectedIncome = useSelector(state => state.userReducer.expectedIncome)

  // HANDLE RATIO 
  const customPercent = useSelector((state) => state.userReducer.customPercent)
  const needPercent = useSelector(state => state.userReducer.customPercent.needPercent)
  const savingPercent = useSelector(state => state.userReducer.customPercent.savingPercent)
  const wantPercent = useSelector(state => state.userReducer.customPercent.wantPercent)

  // HANDLE TRANSACTION TYPES
  // types 
  const incomeTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.incomeTypes || [])
  const savingTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.savingTypes || [])

  // INITIATE COLUMN TYPES IN TABLE 
  const incomeColumns = [
    {
      title: "Income",
      dataIndex: "income",
      key: "income",
    },
  ]
  const savingColumns = [
    {
      title: "Saving",
      dataIndex: "saving",
      key: "saving"
    },
  ]
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
  ]

  // INITIATE FORM 
  const categoryForm = useFormik({
    initialValues: {
      currency: currencyUnit,
      expectedIncome: expectedIncome || 0,

      needPercent: needPercent || 0,
      savingPercent: savingPercent || 0,
      wantPercent: wantPercent || 0,

      needAllocation: 0,
      savingAllocation: 0,
      wantAllocation: 0,

      incomeType: [],
      savingType: [],
      expenseType: {
        needs: [{ type: "rent" }],
        wants: [{ type: "shoes" }],
      },
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  const handleRadioChange = (event) => { // handle between custom or standard input choice
    const { value } = event.target
    if (value === 'standard') {
      setSelectedPercent('standard')
      setShowCustomRatio(false)
      categoryForm.setFieldValue("needPercent", 50)
      categoryForm.setFieldValue("savingPercent", 30)
      categoryForm.setFieldValue("wantPercent", 20)
    } else if (value === 'custom') {
      setSelectedPercent('custom')
      setShowCustomRatio(true)
      categoryForm.setFieldValue("needPercent", customPercent?.needPercent || 0)
      categoryForm.setFieldValue("savingPercent", customPercent?.savingPercent || 0)
      categoryForm.setFieldValue("wantPercent", customPercent?.wantPercent || 0)
    }
  }

  useEffect(() => { // fetch expectedIncome
    dispatch(getUserExpectedIncomeAsync())
  }, [dispatch])

  useEffect(() => { // fetch percents first
    dispatch(getUserPercentAsync())
  }, [dispatch])

  useEffect(() => { // fetch types
    fetchIncomeTypes()
    fetchSavingTypes()
  }, [])

  useEffect(() => {// Check if the currency value in the form is different from the Redux state
    if (currencyUnit && categoryForm.values.currency !== currencyUnit) {
      categoryForm.setFieldValue('currency', currencyUnit)
    }
  }, [currencyUnit]) // add currencyUnit as a dependency

  useEffect(() => { // Check if the expected income in the form is different from the Redux state
    if (expectedIncome && categoryForm.values.currency !== expectedIncome) {
      categoryForm.setFieldValue('expectedIncome', expectedIncome)
    }
  }, [expectedIncome])

  useEffect(() => { // Check if the percent in the form is different from the Redux state
    if (customPercent && (categoryForm.values.needPercent !== needPercent) && (categoryForm.values.savingPercent !== savingPercent) && (categoryForm.values.wantPercent !== wantPercent)) {
      categoryForm.setFieldValue('needPercent', needPercent)
      categoryForm.setFieldValue('savingPercent', savingPercent)
      categoryForm.setFieldValue('wantPercent', wantPercent)
    }
  }, [customPercent, categoryForm.setFieldValue]) // add customPercent as a dependency

  useEffect(() => { // update money allocation calc when expectedIncome or percents change
    const expectedFormIncome = parseFloat(categoryForm.values.expectedIncome) || 0
    const needValue = calcMoneyAllocation(expectedFormIncome, categoryForm.values.needPercent)
    const savingValue = calcMoneyAllocation(expectedFormIncome, categoryForm.values.savingPercent)
    const wantValue = calcMoneyAllocation(expectedFormIncome, categoryForm.values.wantPercent)

    categoryForm.setFieldValue("needAllocation", needValue)
    categoryForm.setFieldValue("savingAllocation", savingValue)
    categoryForm.setFieldValue("wantAllocation", wantValue)
    console.log(needValue, savingValue, wantValue)
  }, [categoryForm.values])


  useEffect(() => { // set initial percent values
    const { needPercent, savingPercent, wantPercent } = customPercent || {}

    if (needPercent === 50 && savingPercent === 30 && wantPercent === 20) { // if have values = 50-30-20 principle
      setSelectedPercent('standard')
      categoryForm.setFieldValue("needPercent", 50)
      categoryForm.setFieldValue("savingPercent", 30)
      categoryForm.setFieldValue("wantPercent", 20)
    } else { // if value not equals to
      setSelectedPercent('custom')
      categoryForm.setFieldValue("needPercent", needPercent || 0)
      categoryForm.setFieldValue("savingPercent", savingPercent || 0)
      categoryForm.setFieldValue("wantPercent", wantPercent || 0)
    }
  }, [customPercent])

  useEffect(() => { // asign income/expense/saving types to the table
    if (incomeTypes.length > 0 && savingTypes.length > 0) {
      categoryForm.setValues({
        ...categoryForm.values,
        incomeType: incomeTypes.map(type => ({ type: type.income_type_name })),
        savingType: savingTypes.map(type => ({ type: type.saving_type_name })),
      })
    }
  }, [incomeTypes, savingTypes])

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
                value={categoryForm.values.currency || ''}
              >
                <option selected>Open this select menu</option>
                <option value="USD">{getCurrencySymbol("USD")} USD</option>
                <option value="VND">{getCurrencySymbol("VND")} VND</option>
                <option value="EUR">{getCurrencySymbol("USD")} EUR</option>
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
                  placeholder="Fill in income" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} value={categoryForm.values.expectedIncome || ''}
                />
              </div>
            </div>
            <div className="form-group money-percent">
              <div className="form-check px-4">
                <input
                  className="form-check-input"
                  type="radio"
                  name="money-percent"
                  id="standard-ratio"
                  value="standard"
                  checked={selectedPercent === 'standard'}
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
                  name="money-percent"
                  id="custom-ratio"
                  value="custom"
                  checked={selectedPercent === 'custom'}
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
                <div className="custom-percent border-shadow">
                  <div className="input-group input-group-sm">
                    <label htmlFor="need-ratio">Need ratio</label>
                    <input id="needPercent" type="text" className="form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="input-group input-group-sm">
                    <label htmlFor="saving-ratio">Saving ratio</label>
                    <input id="savingPercent" type="text" className="form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="input-group input-group-sm">
                    <label htmlFor="want-ratio">Want ratio</label>
                    <input id="wantPercent" type="text" className="form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>
            )}
            <div className="form-group money-allocation">
              <span className="font-mono">
                Needs: {getCurrencySymbol(categoryForm.values.currency)}
                <span>{categoryForm.values.needAllocation}</span>
              </span>
              <span>
                Savings: {getCurrencySymbol(categoryForm.values.currency)}
                <span>{categoryForm.values.savingAllocation}</span>
              </span>
              <span>
                Wants: {getCurrencySymbol(categoryForm.values.currency)}
                <span>{categoryForm.values.wantAllocation}</span>
              </span>
            </div>

            <hr />
            <div className="form-group category-table">
              <h3 className="text-center">Set up Category</h3>
              <div className="category-content">
                <div className="income-table">
                  <CategoryTable
                    columns={incomeColumns}
                    dataSource={incomeTypes.length > 0 ? incomeTypes.map(type => ({ key: type.income_type_id, income: type.income_type_name })) : []}
                  />
                </div>
                <div className="saving-table">
                  <CategoryTable
                    columns={savingColumns}
                    dataSource={savingTypes.length > 0 ? savingTypes.map(type => ({ key: type.saving_type_id, saving: type.saving_type_name })) : []}
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
  )
}


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
    .money-percent {
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
    .custom-percent{
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
    .money-allocation {
      display: flex;
      flex-direction: row;
      span {
        background-color: transparent;
        width: 25%;
        font-size: .875rem;
        line-height: 1.25rem;
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

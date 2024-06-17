import React, { useEffect, useState } from "react"
import { InnerLayout } from "../../styles/Layouts"
import styled from "styled-components"
import { useFormik } from "formik"
import CategoryTable from "../../components/tables/CategoryTable"
import { useDispatch, useSelector } from "react-redux"
import useTransactionType from "../../customHooks/TransactionTypeHook"
import { getCurrencySymbol } from "../../utils/format/CurrencySymbol"
import { fetchUserAsync, getUserExpectedIncomeAsync, getUserPercentAsync } from "../../reducers/UserReducer"
import { calcMoneyAllocation } from "../../utils/calculate/MoneyAllocation"
import { getExpenseCategoriesAsync } from "../../reducers/ExpenseReducer"
import { handleCategoryFormSubmitAsync } from "../../reducers/CategoryFormReducer"
import { addTransactionTypeAsync, getTransactionTypesAsync, updateTransactionTypeAsync } from "../../reducers/TransactionTypeReducer"
import { addExpenseTypeAsync, getExpenseTypesActionAsync, updateExpenseTypeAsync } from "../../reducers/ExpenseTypeReducer"
import { Input } from "antd"

const CategoryPage = () => {
  const dispatch = useDispatch()

  const [showCustomRatio, setShowCustomRatio] = useState(false)
  const [selectedPercent, setSelectedPercent] = useState("")
  const { fetchTransactionTypes: fetchIncomeTypes } = useTransactionType("income")
  const { fetchTransactionTypes: fetchSavingTypes } = useTransactionType("saving")

  // HANDLE CURRENCY UNIT
  const currencyUnit = useSelector(state => state.userReducer.userCurrencyUnit)

  // HANDLE EXPECTED MONTHLY INCOME
  const expectedIncome = useSelector(state => state.userReducer.expectedIncome)

  // HANDLE RATIO 
  const customPercent = useSelector(state => state.userReducer.customPercent)
  const needPercent = useSelector(state => state.userReducer.customPercent.needPercent)
  const savingPercent = useSelector(state => state.userReducer.customPercent.savingPercent)
  const wantPercent = useSelector(state => state.userReducer.customPercent.wantPercent)

  // HANDLE TRANSACTION TYPES
  const incomeTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.incomeTypes || [])
  const savingTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.savingTypes || [])
  const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes)


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
        needs: [],
        wants: [],
      },
    },
    onSubmit: async (values) => {
      const processedValues = {
        ...values,
        needPercent: Number(values.needPercent),
        savingPercent: Number(values.savingPercent),
        wantPercent: Number(values.wantPercent),
      }
      await dispatch(handleCategoryFormSubmitAsync(processedValues))
    }
  })


  const incomeData = categoryForm.values.incomeType.map((item, index) => ({ key: `income-${index}`, income: item.type }))
  const savingData = categoryForm.values.savingType.map((item, index) => ({ key: `saving-${index}`, saving: item.type }))
  const needsData = categoryForm.values.expenseType.needs.map((item, index) => ({ key: `needs-${index}`, needs: item.type }))
  const wantsData = categoryForm.values.expenseType.wants.map((item, index) => ({ key: `wants-${index}`, wants: item.type }))


  const [incomeRows, setIncomeRows] = useState(incomeData)
  const [savingRows, setSavingRows] = useState(savingData)
  const [needsRows, setNeedsRows] = useState(needsData)
  const [wantsRows, setWantsRows] = useState(wantsData)

  const incomeColumns = [
    { title: "Income", dataIndex: "income", key: "income" },
  ]
  const savingColumns = [
    { title: "Saving", dataIndex: "saving", key: "saving" },
  ]
  const needsColumns = [
    { title: "Needs", dataIndex: "needs", key: "needs" },
  ]
  const wantsColumns = [
    { title: "Wants", dataIndex: "wants", key: "wants" },
  ]

  const handleRadioChange = (event) => {
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

  const addNewRow = (type) => {
    const newRow = { key: `${type}-new`, type: type }

    switch (type) {
      case 'income':
        setIncomeRows([...incomeRows, newRow])
        break
      case 'saving':
        setSavingRows([...savingRows, newRow])
        break
      case 'needs':
        setNeedsRows([...needsRows, newRow])
        break
      case 'wants':
        setWantsRows([...wantsRows, newRow])
        break
      default:
        break
    }
  }

  const handleRowChange = (type, index, value) => {
    const updateRows = (rows, setRows) => {
      const updatedRows = [...rows]
      updatedRows[index].type = value
      setRows(updatedRows)
    }

    switch (type) {
      case 'income':
        updateRows(incomeRows, setIncomeRows)
        break
      case 'saving':
        updateRows(savingRows, setSavingRows)
        break
      case 'needs':
        updateRows(needsRows, setNeedsRows)
        break
      case 'wants':
        updateRows(wantsRows, setWantsRows)
        break
      default:
        break
    }
  }

  const handleChanges = async () => {
    const changes = []

    const saveRows = (rows, addAction, updateAction, type) => {
      for (const row of rows) {
        if (row.key.includes('new')) {
          if (type === 'income' || type === 'saving') {
            changes.push(dispatch(addAction(type, { [`${type}_type_name`]: row.type })))
          } else if (type === 'needs') {
            changes.push(dispatch(addAction({ expense_category_id: 2, expense_type_name: row.type })))
          } else if (type === 'wants') {
            changes.push(dispatch(addAction({ expense_category_id: 1, expense_type_name: row.type })))
          }
        }
        else {
          const id = row.key.split('-')[1]
          if (type === 'income' || type === 'saving') {
            changes.push(dispatch(updateAction(type, id, { [`${type}_type_name`]: row.type })))
          } else if (type === 'needs') {
            changes.push(dispatch(updateAction(id, { expense_type_id: id, expense_category_id: 2, expense_type_name: row.type, })))
          } else if (type === 'wants') {
            changes.push(dispatch(updateAction(id, { expense_type_id: id, expense_category_id: 1, expense_type_name: row.type })))
          }
        }
      }
    }

    saveRows(incomeRows, addTransactionTypeAsync, updateTransactionTypeAsync, 'income')
    saveRows(savingRows, addTransactionTypeAsync, updateTransactionTypeAsync, 'saving')
    saveRows(needsRows, addExpenseTypeAsync, updateExpenseTypeAsync, 'needs')
    saveRows(wantsRows, addExpenseTypeAsync, updateExpenseTypeAsync, 'wants')

    if (changes.length > 0) {
      await Promise.all(changes)
      alert('Changes saved successfully!')
      dispatch(getTransactionTypesAsync(), getExpenseTypesActionAsync())
    } else {
      alert('No changes detected')
    }
  }

  useEffect(() => { // fetch user
    dispatch(fetchUserAsync())
  }, [dispatch])

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

  useEffect(() => {
    dispatch(getExpenseTypesActionAsync())
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

  useEffect(() => {
    if (incomeTypes.length > 0 && savingTypes.length > 0 && expenseTypes.length > 0) {
      const updatedIncomeData = incomeTypes.map(type => ({ key: `income-${type.income_type_id}`, type: type.income_type_name }))
      const updatedSavingData = savingTypes.map(type => ({ key: `saving-${type.saving_type_id}`, type: type.saving_type_name }))
      const updatedNeedsData = expenseTypes.filter(type => type.expense_category_id === 2).map(type => ({ key: `needs-${type.expense_type_id}`, type: type.expense_type_name }));
      const updatedWantsData = expenseTypes.filter(type => type.expense_category_id === 1).map(type => ({ key: `wants-${type.expense_type_id}`, type: type.expense_type_name }));

      setIncomeRows(updatedIncomeData)
      setSavingRows(updatedSavingData)
      setNeedsRows(updatedNeedsData)
      setWantsRows(updatedWantsData)
    }
  }, [incomeTypes, savingTypes, expenseTypes])

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
                    <input id="needPercent" type="text" className="custom-input form-control" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="input-group input-group-sm">
                    <label htmlFor="saving-ratio">Saving ratio</label>
                    <input id="savingPercent" type="text" className="form-control custom-input" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="input-group input-group-sm">
                    <label htmlFor="want-ratio">Want ratio</label>
                    <input id="wantPercent" type="text" className="form-control custom-input" onChange={categoryForm.handleChange} onBlur={categoryForm.handleBlur} />
                    <span className="input-group-text">%</span>
                  </div>
                </div>
              </div>
            )}
            <div className="form-group money-allocation">
              <span className="font-mono">
                Needs: {getCurrencySymbol(categoryForm.values.currency)}
                {categoryForm.values.needAllocation}
              </span>
              <span className="font-mono">
                Savings: {getCurrencySymbol(categoryForm.values.currency)}
                {categoryForm.values.savingAllocation}
              </span>
              <span className="font-mono">
                Wants: {getCurrencySymbol(categoryForm.values.currency)}
                {categoryForm.values.wantAllocation}
              </span>
            </div>
            <div className="form-group btn-submit">
              <button type="submit" className="btn btn-warning w-100">
                Save
              </button>
            </div>
            <hr />
            <div className="form-group category-table">
              <h3 className="text-center">Add Types Entry</h3>
              <div className="category-content">
                <div className="income-table">
                  <CategoryTable
                    columns={incomeColumns}
                    dataSource={incomeRows.map((row, index) => ({
                      ...row,
                      income: <Input value={row.type} onChange={(e) => handleRowChange('income', index, e.target.value)} />
                    }))}
                    rowClassName={() => 'editable-row'}
                  />
                  <div className="add-row" onClick={() => addNewRow('income')}>+ Add entry</div>
                </div>
                <div className="saving-table">
                  <CategoryTable
                    columns={savingColumns}
                    dataSource={savingRows.map((row, index) => ({
                      ...row,
                      saving: <Input value={row.type} onChange={(e) => handleRowChange('saving', index, e.target.value)} />
                    }))}
                    rowClassName={() => 'editable-row'}
                  /> 
                  <div className="add-row" onClick={() => addNewRow('saving')}>+ Add entry</div>
                </div>
                <div className="expense-table">
                  <div className="expense-table-columns">
                    <div className="expense-column">
                      <CategoryTable
                        columns={needsColumns}
                        dataSource={needsRows.map((row, index) => ({
                          ...row,
                          needs: <Input value={row.type} onChange={(e) => handleRowChange('needs', index, e.target.value)} />
                        }))}
                        rowClassName={() => 'editable-row'}
                      />
                      <div className="add-row" onClick={() => addNewRow('needs')}>+ Add entry</div>
                    </div>
                    <div className="expense-column">
                      <CategoryTable
                        columns={wantsColumns}
                        dataSource={wantsRows.map((row, index) => ({
                          ...row,
                          wants: <Input value={row.type} onChange={(e) => handleRowChange('wants', index, e.target.value)} />
                        }))}
                        rowClassName={() => 'editable-row'}
                      />
                      <div className="add-row" onClick={() => addNewRow('wants')}>+ Add entry</div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="btn-submit">
                <button type="submit" className="btn btn-warning w-100" onClick={handleChanges}>
                  Save
                </button>
              </div>
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
  input {
    background-color: var(--input-color);
    border-radius: 10px;
    border: none;
    color: var(--color-white)
  }
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
      flex-direction: row;;
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
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: var(--modal-color);
      padding: 1.25rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      label {
        width: 100%;
      }
      .custom-input{
        padding: .5rem;
      }
      .input-group {
        width: 30%;
      }
    }
    .money-allocation  {
      display: flex;
      flex-direction: row;
      background-color: var(--modal-color);
      padding: .5rem;
      border: 2px solid var(--border-color);
      border-radius: 10px;
      span {
        text-align: center;
        font-weight: 600;
        background-color: transparent;
        width: 33.3%;
        font-size: .875rem;
        line-height: 1.25rem;
      }
    }
  }

  .category-content {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    text-align: center;
    margin: 1.25rem 0;
  }

  .income-table,
  .saving-table,
  .expense-table {
    background-color: var(--select-color);
    padding: 1rem 1.25rem;
    border-radius: 20px;
  }

  .income-table {
    width: 20%;
  }

  .saving-table {
    width: 20%;
  }

  .expense-table {
    width: 50%;
  }

  .th-expense-table {
    font-size: 1rem;
    font-weight: 600;
    padding-bottom: 1rem;
  }

  .expense-table-columns {
    display: flex;
    flex-direction: row;
    padding: 0 1rem;
  }
  .expense-column {
    flex: 1;
    margin: 0 0.5rem;
  }
  .add-row {
    font-size: .7rem;
    font-weight: 500;
    color: var(--color-grey);
    font-style: italic;
    padding: 16px;
  }
`

export default CategoryPage
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../../styles/Layouts'
import BudgetingTable from '../../components/tables/BudgetingTable'
import { useDispatch, useSelector } from 'react-redux'
import { getBudgetActionAsync, updateBudgetAmountAsync } from '../../reducers/BudgetReducer'
import { formatBudgetingData } from '../../utils/format/BudgetDataFormat'
import useTransaction from '../../customHooks/TransactionHook'
import { getExpenseActionAsync } from '../../reducers/ExpenseReducer'
import { getExpenseTypesActionAsync } from '../../reducers/ExpenseTypeReducer'

const BudgetingPage = () => {
  const dispatch = useDispatch()
  const budgets = useSelector(state => state.budgetReducer.budgets)
  const { fetchTransactions: fetchIncome } = useTransaction('incomes')
  const { fetchTransactions: fetchSaving } = useTransaction('savings')
  const incomes = useSelector(state => state.transactionReducer.transactions.incomes)
  const savings = useSelector(state => state.transactionReducer.transactions.savings)
  const expenses = useSelector(state => state.expenseReducer.expenses)
  const [budgetingData, setBudgetingData] = useState({ categories: [] })

  useEffect(() => {
    dispatch(getBudgetActionAsync())
  }, [])

  useEffect(() => {
    fetchIncome()
  }, [])

  useEffect(() => {
    fetchSaving()
  }, [])

  useEffect(() => {
    dispatch(getExpenseActionAsync())
  }, [])

  useEffect(() => {
    dispatch(getExpenseTypesActionAsync())
  }, [])

  useEffect(() => {
    if (budgets.length > 0 && incomes.length > 0 && savings.length > 0 && expenses.length > 0) {
      setBudgetingData(formatBudgetingData(budgets, incomes, savings, expenses))
    }
  }, [])

  const handleUpdateBudget = (budgetId, budgetAmount) => {
    dispatch(updateBudgetAmountAsync(budgetId, budgetAmount))
  };

  return (
    <BudgetingPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="budgeting-container">
            <div className="content-container content-left text-center">
              <h1 className='text-center'>June Budgeting</h1>
              <hr />
              <BudgetingTableStyled>
                <BudgetingTable data={budgetingData} onUpdateBudget={handleUpdateBudget} />
              </BudgetingTableStyled>
            </div>
            <div className="content-container content-right text-left">
              <h1 className='text-center'> -$1400.06 <br /> Left to budget</h1>
              <hr />
              <div className="summary">
                <div className="income-insight">
                  <h2 className='insight-title'>Income</h2>
                  <p>$100 earned / $10000 budget (10/100%)</p>
                </div>
                <hr />
                <div className="ratio-insight">
                  <h2 className='insight-title'>Ratios</h2>
                  <p>50 - 30 - 20</p>
                </div>
                <hr />
                <div className="allocation-insight">
                  <div className="need-insight">
                    <h2 className='insight-title'>Needs - 50</h2>
                    <p>$100 spent / $10000 budget</p>
                  </div>
                  <div className="saving-insight">
                    <h2 className='insight-title'>Savings - 30</h2>
                    <p>$100 saved / $10000 budget</p>
                  </div>
                  <div className="want-insight">
                    <h2 className='insight-title'>Wants - 20</h2>
                    <p>$100 spent / $10000 budget</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InnerLayout>
    </BudgetingPageStyled>
  )
}

const BudgetingPageStyled = styled.div`
  h1 {
    font-size: 1.6rem;
    font-weight: 700;
  }
  p {
    font-weight: 500;
  }
  button {
    border-radius: 10px;
    padding: 0.5rem 1rem;
  }
  span {
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }
  .budgeting-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr) repeat(5, 1fr);
    gap: 1rem;
    .content-left {
      grid-column: span 6; 
    }
    .content-right {
      grid-column: span 4; 
    }
  }
  .btn-con {
    margin: 2rem 0;
    display: flex;
    justify-content: end;
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
  .white-text {
    color: white;
    font-weight: 400;
  }
  .na-text {
    font-size: 0.7em; /* Decrease font size for "N/A" */
    color: gray; /* Optional: Change color for "N/A" */
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn); 
  }
  .summary {
    display: grid;
    gap: 1rem;
    .insight-title {
      color: var(--color-yellow);
      font-size: 1rem; 
      font-weight: 600;
      text-decoration: underline;
    }
    p {
      font-size: 1rem;
      font-family: "Courier Prime", monospace;
      font-weight: 400;
      color: white;
      padding: 0;
      margin: 0;
      line-height: 2rem;
    }
  }
`;

const BudgetingTableStyled = styled.div`
  margin: 2rem 0rem;
`;

export default BudgetingPage;

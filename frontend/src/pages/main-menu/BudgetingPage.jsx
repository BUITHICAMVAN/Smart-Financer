import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import BudgetingTable from '../../components/tables/BudgetingTable';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgetActionAsync, updateBudgetAmountAsync } from '../../reducers/BudgetReducer';
import { formatBudgetingData } from '../../utils/format/BudgetDataFormat';
import useTransaction from '../../customHooks/TransactionHook';
import { fetchCurrentMonthExpensesAsync } from '../../reducers/ExpenseReducer';
import { getExpenseTypesActionAsync } from '../../reducers/ExpenseTypeReducer';
import useTransactionType from '../../customHooks/TransactionTypeHook';
import ReturnButton from '../../components/button/ReturnButton';
import { getCurrentMonth } from '../../utils/CurrentDate';

const BudgetingPage = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(state => state.budgetReducer.budgets);
  const { fetchMonthlyTransaction: fetchIncome } = useTransaction('incomes');
  const { fetchMonthlyTransaction: fetchSaving } = useTransaction('savings');
  const { fetchTransactionTypes: fetchIncomeTypes } = useTransactionType("income");
  const { fetchTransactionTypes: fetchSavingTypes } = useTransactionType("saving");

  const incomes = useSelector(state => state.transactionReducer.currentMonthTransactions.incomes);
  const savings = useSelector(state => state.transactionReducer.currentMonthTransactions.savings);
  const expenses = useSelector(state => state.expenseReducer.currentMonthExpenses);
  const [budgetingData, setBudgetingData] = useState({ categories: [] });

  // HANDLE TRANSACTION TYPES
  const incomeTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.incomeTypes || []);
  const savingTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.savingTypes || []);
  const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes);

  const currentMonth = getCurrentMonth()

  useEffect(() => {
    dispatch(getBudgetActionAsync());
  }, [dispatch]);

  useEffect(() => {
    fetchIncome();
  }, []);

  useEffect(() => {
    fetchSaving();
  }, []);

  useEffect(() => {
    dispatch(fetchCurrentMonthExpensesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getExpenseTypesActionAsync());
  }, [dispatch]);

  useEffect(() => { // fetch types
    fetchIncomeTypes();
    fetchSavingTypes();
  }, []);

  useEffect(() => {
    if (budgets.length > 0 && incomes.length > 0 && savings.length > 0 && expenses.length > 0 && incomeTypes.length > 0 && savingTypes.length > 0 && expenseTypes.length > 0) {
      setBudgetingData(formatBudgetingData(budgets, incomes, savings, expenses, incomeTypes, savingTypes, expenseTypes));
    }
  }, [budgets, incomes, savings, expenses, incomeTypes, savingTypes, expenseTypes]);

  const handleUpdateBudget = (budgetId, budgetAmount) => {
    dispatch(updateBudgetAmountAsync(budgetId, budgetAmount));
  };

  return (
    <BudgetingPageStyled>
      <InnerLayout>
        <ReturnButton/>
        <div className="container">
          <div className="budgeting-container">
            <div className="content-container content-left text-center">
              <h1 className='text-center'>{currentMonth} Budgeting</h1>
              <hr />
              <BudgetingTableStyled>
                <BudgetingTable data={budgetingData} onUpdateBudget={handleUpdateBudget} />
              </BudgetingTableStyled>
            </div>
            <div className="content-container content-right text-left">
              <h1 className='text-center'> -$1400.06 <br /> Left to budget</h1>
              <hr />
              <div className="summary">
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
      <MobileMessage>This feature is only available on website or desktop screen.</MobileMessage>
    </BudgetingPageStyled>
  );
};

const BudgetingPageStyled = styled.div`
  position: relative;
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
  
  @media (max-width: 1280px) {
    .container, .budgeting-container {
      display: none;
    }
  }
`;

const BudgetingTableStyled = styled.div`
  margin: 2rem 0rem;
`;

const MobileMessage = styled.div`
  display: none;
  font-family: "Courier Prime", monospace;
  font-size: 1rem;
  font-weight: 400;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  
  @media (max-width: 1280px) {
    display: block;
  }
`;

export default BudgetingPage;

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import BudgetingTable from '../../components/tables/BudgetingTable';

const mockBudgetingData = {
  categories: [
    {
      key: 'income',
      category: 'Income',
      children: [
        { key: 'base-salary', category: 'Base Salary', budget: 60000, actual: 59000 },
        { key: 'side-hustles', category: 'Side Hustles', budget: 7000, actual: 6800 },
        { key: 'bonus', category: 'Bonus', budget: 5000, actual: 4500 },
        { key: 'investments', category: 'Investments', budget: 4000, actual: 4200 },
      ]
    },
    {
      key: 'expenses',
      category: 'Expenses',
      children: [
        {
          key: 'essentials',
          category: 'Essentials',
          children: [
            { key: 'renting', category: 'Renting', budget: 12000, actual: 11500 },
            { key: 'groceries', category: 'Groceries', budget: 6000, actual: 6500 },
            { key: 'billings', category: 'Billings (electric, internet, water, ...)', budget: 3000, actual: 3200 },
            { key: 'transport', category: 'Transport (gas, uber, ...)', budget: 2000, actual: 2100 },
          ]
        },
        {
          key: 'non-essentials',
          category: 'Non-Essentials',
          children: [
            { key: 'coffee', category: 'Coffee', budget: 1000, actual: 900 },
            { key: 'leisure', category: 'Leisure Activities', budget: 2000, actual: 1800 },
            { key: 'shopping', category: 'Shopping', budget: 2500, actual: 2300 },
          ]
        }
      ]
    },
    {
      key: 'savings',
      category: 'Savings',
      children: [
        { key: 'house', category: 'Properties - House', budget: 8000, actual: 7500 },
        { key: 'retirement', category: 'Retirement', budget: 6000, actual: 6500 },
        { key: 'emergency', category: 'Emergency', budget: 3000, actual: 2800 },
        { key: 'savings', category: 'Savings', budget: 5000, actual: 4700 },
        { key: 'travel', category: 'Travel', budget: 4000, actual: 4200 },
      ]
    }
  ]
};

const BudgetingPage = () => {
  const [budgetingData, setBudgetingData] = useState(mockBudgetingData);

  useEffect(() => {
    // Here, you would fetch real budgeting data if needed
    // For now, we're using the mock data
  }, []);

  return (
    <BudgetingPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="budgeting-container">
            <div className="content-container content-left text-center">
              <h1 className='text-center'>June Budgeting</h1>
              <hr />
              <BudgetingTableStyled>
                <BudgetingTable data={budgetingData} />
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
  );
};

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
`

export default BudgetingPage;

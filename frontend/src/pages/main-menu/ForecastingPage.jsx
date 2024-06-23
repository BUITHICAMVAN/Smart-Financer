import React, { useEffect } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useDispatch } from 'react-redux';
import ForecastTable from '../../components/tables/ForecastTable';

const mockForecastData = [
  {
    key: 'income',
    category: 'Income',
    children: [
      { key: 'base-salary', category: 'Base Salary', january: 5000, february: 5000, march: 5000, april: 5000, may: 5000, june: 5000, july: 5000, august: 5000, september: 5000, october: 5000, november: 5000, december: 5000 },
      { key: 'side-hustles', category: 'Side Hustles', january: 600, february: 600, march: 600, april: 600, may: 600, june: 600, july: 600, august: 600, september: 600, october: 600, november: 600, december: 600 },
      { key: 'bonus', category: 'Bonus', january: 0, february: 0, march: 0, april: 0, may: 0, june: 0, july: 0, august: 0, september: 5000, october: 0, november: 0, december: 0 },
      { key: 'investments', category: 'Investments', january: 400, february: 400, march: 400, april: 400, may: 400, june: 400, july: 400, august: 400, september: 400, october: 400, november: 400, december: 400 },
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
          { key: 'renting', category: 'Renting', january: 1000, february: 1000, march: 1000, april: 1000, may: 1000, june: 1000, july: 1000, august: 1000, september: 1000, october: 1000, november: 1000, december: 1000 },
          { key: 'groceries', category: 'Groceries', january: 500, february: 500, march: 500, april: 500, may: 500, june: 500, july: 500, august: 500, september: 500, october: 500, november: 500, december: 500 },
          { key: 'billings', category: 'Billings (electric, internet, water, ...)', january: 250, february: 250, march: 250, april: 250, may: 250, june: 250, july: 250, august: 250, september: 250, october: 250, november: 250, december: 250 },
          { key: 'transport', category: 'Transport (gas, uber, ...)', january: 166.67, february: 166.67, march: 166.67, april: 166.67, may: 166.67, june: 166.67, july: 166.67, august: 166.67, september: 166.67, october: 166.67, november: 166.67, december: 166.67 },
        ]
      },
      {
        key: 'non-essentials',
        category: 'Non-Essentials',
        children: [
          { key: 'coffee', category: 'Coffee', january: 83.33, february: 83.33, march: 83.33, april: 83.33, may: 83.33, june: 83.33, july: 83.33, august: 83.33, september: 83.33, october: 83.33, november: 83.33, december: 83.33 },
          { key: 'leisure', category: 'Leisure Activities', january: 166.67, february: 166.67, march: 166.67, april: 166.67, may: 166.67, june: 166.67, july: 166.67, august: 166.67, september: 166.67, october: 166.67, november: 166.67, december: 166.67 },
          { key: 'shopping', category: 'Shopping', january: 208.33, february: 208.33, march: 208.33, april: 208.33, may: 208.33, june: 208.33, july: 208.33, august: 208.33, september: 208.33, october: 208.33, november: 208.33, december: 208.33 },
        ]
      }
    ]
  },
  {
    key: 'savings',
    category: 'Savings',
    children: [
      { key: 'house', category: 'Properties - House', january: 666.67, february: 666.67, march: 666.67, april: 666.67, may: 666.67, june: 666.67, july: 666.67, august: 666.67, september: 666.67, october: 666.67, november: 666.67, december: 666.67 },
      { key: 'retirement', category: 'Retirement', january: 500, february: 500, march: 500, april: 500, may: 500, june: 500, july: 500, august: 500, september: 500, october: 500, november: 500, december: 500 },
      { key: 'emergency', category: 'Emergency', january: 250, february: 250, march: 250, april: 250, may: 250, june: 250, july: 250, august: 250, september: 250, october: 250, november: 250, december: 250 },
      { key: 'savings', category: 'Savings', january: 416.67, february: 416.67, march: 416.67, april: 416.67, may: 416.67, june: 416.67, july: 416.67, august: 416.67, september: 416.67, october: 416.67, november: 416.67, december: 416.67 },
      { key: 'travel', category: 'Travel', january: 333.33, february: 333.33, march: 333.33, april: 333.33, may: 333.33, june: 333.33, july: 333.33, august: 333.33, september: 333.33, october: 333.33, november: 333.33, december: 333.33 },
    ]
  }
]

const ForecastPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Add any side effects or data fetching here if needed
  }, [dispatch]);

  return (
    <ForecastPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <h3 className="text-center">12-Month Forecast</h3>
            <hr />
            <ForecastTable data={mockForecastData} />
          </div>
        </div>
      </InnerLayout>
    </ForecastPageStyled>
  );
};

const ForecastPageStyled = styled.div`
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
`;

export default ForecastPage;

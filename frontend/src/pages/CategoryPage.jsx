import React from 'react';
import { InnerLayout } from '../styles/Layouts';
import styled from 'styled-components';

const incomeColumns = [
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  }
];

const incomeData = [
  {
    key: '1',
    source: 'CSE salary'
  },
  {
    key: '2',
    source: 'Freelance Income'
  },
  {
    key: '3',
    source: 'Bouygues Contrucstion IT'
  },
];

const savingColumns = [
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  }
];

const savingData = [
  {
    key: '1',
    source: 'CSE salary'
  },
  {
    key: '2',
    source: 'Freelance Income'
  },
  {
    key: '3',
    source: 'Bouygues Contrucstion IT'
  },
];

const expenseColumns = [
  {
    title: 'Needs',
    dataIndex: 'needs',
    key: 'need',
  },
  {
    title: 'Wants',
    dataIndex: 'wants',
    key: 'want'
  }
];

const expenseData = [
  {
    key: '1',
    expense: 'Rent',
    type: 'Needs'
  },
  {
    key: '2',
    expense: 'Groceries',
    type: 'Needs'
  },
  {
    key: '3',
    expense: 'Dining Out',
    type: 'Wants'
  },
  {
    key: '4',
    expense: 'Gaming Subscription',
    type: 'Wants'
  },
];

const preprocessExpenseData = (expenseData) => {
  const needsData = expenseData.filter(item => item.type === 'Needs').map(item => item.expense);
  const wantsData = expenseData.filter(item => item.type === 'Wants').map(item => item.expense);

  // Determine the longest length to ensure both columns align
  const maxLength = Math.max(needsData.length, wantsData.length);

  // Prepare the dataSource for the table
  const dataSource = Array.from({ length: maxLength }).map((_, index) => ({
    key: index,
    needs: needsData[index] || '', // Use an empty string if there's no corresponding item
    wants: wantsData[index] || '', // Use an empty string if there's no corresponding item
  }));

  return dataSource;
};

const processedExpenseData = preprocessExpenseData(expenseData);

const CategoryPage = () => {
  return (
    <CategoryStyle>
      <InnerLayout>
        <div className="container">
          <div className="content-container category-container">
            <form className='category-form '>
              <h3>Tailor My Budget</h3>
              <div className="form-group">
                <p>Currency</p>
                <select class="form-select form-select-lg border-shadow mb-3">
                  <option selected>Open this select menu</option>
                  <option value="1">USD</option>
                  <option value="2">VND</option>
                  <option value="3">EUR</option>
                </select>
              </div>
              <div className="form-group">
                <p>Expected monthly income</p>
                <input type="text" className='form-control form-control-sm border-shadow mb-3' id='currency' name='currency' placeholder='Fill in income' />
              </div>
              <div className="form-group">
                <p>Expense Ratio</p>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" />
                  <label className="form-check-label" htmlFor="inlineRadio1"><span>Standard</span></label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" defaultValue="option2" />
                  <label className="form-check-label" htmlFor="inlineRadio2"><span>Custom</span></label>

                </div>
              </div>
              <div className="custom-ratio border-shadow">
                <div className="input-group input-group-sm">
                  <input type="text" className="form-control" />
                  <span className="input-group-text">%</span>
                </div>
                <div className="input-group input-group-sm">
                  <input type="text" className="form-control" />
                  <span className="input-group-text">%</span>
                </div>
                <div className="input-group input-group-sm">
                  <input type="text" className="form-control" />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </form>
            <hr />
            <div className="category-table">
              <h3 className="text-center">Set up Category</h3>
              <div className="category-content">
                <div className="income-table">
                  <table className='table table-responsive'>
                    <thead>
                      <tr>
                        <th colspan='2'><h3>Income</h3></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span></span></td>
                      </tr>
                      <tr>
                        <td><span>1</span></td>
                      </tr>
                      <tr>
                        <td><span>3</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="saving-table">
                  <table className='table table-responsive'>
                    <thead>
                      <tr>
                        <th colspan='2'><h3>Saving</h3></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span></span></td>
                      </tr>
                      <tr>
                        <td><span>1</span></td>
                      </tr>
                      <tr>
                        <td><span>3</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="expense-table">
                  <table className='table table-responsive expense-table'>
                    <thead>
                      <tr>
                        <th colspan='2'><h3>Expenses</h3></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span>Needs</span></td>
                        <td><span>Wants</span></td>
                      </tr>
                      <tr>
                        <td><span>1</span></td>
                        <td><span>2</span></td>
                      </tr>
                      <tr>
                        <td><span>3</span></td>
                        <td><span>4</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='btn-submit'>
              <button className='btn btn-warning w-100'>Save</button>
            </div>
          </div>
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
  .category-form {
    .form-group {
      margin: 1.6rem 0;
      .form-select, .form-control {
        font-weight: 400;
        font-size: 0.875rem;
        text-align: left;
        color: var(--color-white);
        border: none;
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
    }
    .custom-ratio {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .input-group {
        width: 30%;
        input, span {
          background-color: var(--input-color);
          border-radius: 10px;
          border: none;
          color: rgba(113, 113, 122, 1)
        }
      }
      background-color: var(--select-color);
      padding: 1.25rem;
    }
  }
  .category-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr) repeat(3, 1fr) repeat(6, 1fr);
    gap: 2rem;
    margin: 1.6rem 0;
    .income-table, .saving-table, .expense-table {
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
    .table {
      text-align: center;
      h3 {
        font-size: 0.875rem;
        font-weight: 600;
        padding-bottom: .5rem;
      }
      span {
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-style: normal;
      }
    }
    .table, th, td {
      --bs-table-bg: transparent;
      border: none;
      tbody {
        span {
          padding: 0 1rem;
          font-family: "Courier Prime", monospace;
          font-weight: 400;
        }
        tr {
          height: 35px;
        }
        tr:first-child {
          background-color: rgba(39, 39, 42, 1);
          span {
            font-weight: 500;
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-style: normal;
          }
        }
      }
    }
  }
`;

export default CategoryPage
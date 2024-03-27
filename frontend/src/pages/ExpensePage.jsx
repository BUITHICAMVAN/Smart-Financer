import React, { useState } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../styles/Layouts'
import { bracket } from '../utils/Icons'

const ExpensePage = () => {
  const [month, setMonth] = useState('March')

  const [amount, setAmount] = useState("100")
  const [currency, setCurrency] = useState("$")
  return (
    <ExpensePageStyled>
      <InnerLayout>
        <div className='container'>
          <div className="expense-container">
            <div className="content-container content-left text-center">
              <h1>{month} Entries</h1>
              <hr />
              <div className="expense-content">
                <div className="btn-con">
                  <button className="btn btn-dark">Export</button>
                  <button className="btn btn-warning">Add Entry</button>
                </div>
                <table className='table'>
                  <thead>
                    <tr>
                      <th><span>Date & Time</span></th>
                      <th><span>Expense type</span></th>
                      <th><span>Needs</span></th>
                      <th><span>Wants</span></th>
                      <th><span>Evaluate</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span>1</span></td>
                      <td><span>2</span></td>
                      <td><span>3</span></td>
                      <td><span>4</span></td>
                      <td><span>5</span></td>
                      <td><span className='edit-btn'>Edit</span></td>
                      <td><span className='del-btn'>Delete</span></td>
                    </tr>
                    <tr>
                      <td><span>1</span></td>
                      <td><span>2</span></td>
                      <td><span>3</span></td>
                      <td><span>4</span></td>
                      <td><span>5</span></td>
                      <td><span className='edit-btn'>Edit</span></td>
                      <td><span className='del-btn'>Delete</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='content-container content-right text-left'>
              <h1 className='text-center'>Expense Insights</h1>
              <hr />
              <div className='insight'>
                {/* <div className="allotment">
                  <span className='insight-title'>Allotment</span>
                  <div className="main">
                    <div className="amount">
                      <span>Needs: ${amount}</span>
                      <span>Wants: ${amount}</span>
                    </div>
                    <div className="bracket">
                      <span>{currency}{amount}</span>
                    </div>
                  </div>
                </div> */}
                <div className="spending">
                  <span className='insight-title'>Spendings</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: ${amount}</p>
                      <p>Wants: ${amount}</p>
                    </div>
                    <div className="bracket">
                      <p>{'}'}</p>
                      <p>{currency}{amount}</p>
                    </div>
                  </div>
                </div>
                <div className="money-left">
                  <span className='insight-title'>Money Left</span>
                  <div className="main">
                    <div className="amount">
                      <p>Needs: ${amount}</p>
                      <p>Wants: ${amount}</p>
                    </div>
                    <div className="bracket">
                      <p>{'}'}</p>
                      <p>{currency}{amount}</p>
                    </div>
                  </div>
                </div>
                <div className="saving">
                  <span className='insight-title'>Savings</span>
                  <div className="main">
                    <div className="amount">
                      <p>Total Savings: ${amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InnerLayout>
    </ExpensePageStyled>
  )
}

const ExpensePageStyled = styled.div`
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
  .edit-btn {
    color: var(--edit-btn);
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
`;

export default ExpensePage
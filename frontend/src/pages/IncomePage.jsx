import React, {useState } from 'react'
import styled from 'styled-components'
import { InnerLayout } from '../styles/Layouts';

const IncomePage = () => {
  const [month, setMonth] = useState('March')

  const [amount, setAmount] = useState("100")

  return (
    <IncomePageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            {/* <h3>{month} Income Entries</h3> */}
            <div className="income-total">
              <p>$ {amount}</p>
              <h2>Total Income</h2>
            </div>
            <div className="btn-con">
              {/* <button className="btn btn-dark">Export</button> */}
              <button className="btn btn-warning">Add Entry</button>
            </div>
            <hr />
            <div className="income-content">
              <table className='table'>
                <thead>
                  <tr>
                    <th><span>Date & Time</span></th>
                    <th><span>Income type</span></th>
                    <th><span>Amount</span></th>
                    <th><span>Note</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span>1</span></td>
                    <td><span>2</span></td>
                    <td><span>3</span></td>
                    <td><span>4</span></td>
                    <td><span className='edit-btn'>Edit</span></td>
                    <td><span className='del-btn'>Delete</span></td>
                  </tr>
                  <tr>
                    <td><span>1</span></td>
                    <td><span>2</span></td>
                    <td><span>3</span></td>
                    <td><span>4</span></td>
                    <td><span className='edit-btn'>Edit</span></td>
                    <td><span className='del-btn'>Delete</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </InnerLayout>
    </IncomePageStyled>
  )
}

const IncomePageStyled = styled.div`
  p {
    font-weight: 500;
  }
  button {
    border-radius: 20px;
    padding: 0.5rem 1rem;
  }
  span {
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 500;
  }
  .btn-con {
    margin: 2rem 0;
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
`;

export default IncomePage
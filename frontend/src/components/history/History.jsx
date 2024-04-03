import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const History = () => {

    const [useMonth, setMonth] = useState("March")

    return (
        <HistoryStyled>
            <div className="history-con">
                <div className="history-title">
                    <h2>{useMonth} Transactions</h2>
                    <NavLink to='/expense-page' className={'history-detail'}><h2>View in detail</h2></NavLink>
                </div>
                <div className="history-table text-center">
                    <table className='table table-responsive'>
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
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    .history-title {
      display: flex;
      justify-content: space-between;
    }
    .history-detail {
        text-decoration: none;
    }
    .history-detail h2 {
        text-decoration: none;
        color: var(--color-yellow);
        font-weight: 500;
    }
    .history-table {
      thead {
        span {
          font-weight: 600;
          color: white;
        }
      }
      tbody > tr {
        background-color: var(--input-color);
        border-radius: 0.5rem; 
      }
    }
`;

export default History
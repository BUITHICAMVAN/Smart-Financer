import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/GlobalContext';
import { NavLink } from 'react-router-dom'

function History() {
    const { transactionHistory } = useGlobalContext()

    const [...history] = transactionHistory()

    const [useMonth, setMonth] = useState("March")

    return (
        <HistoryStyled>
            <div className="history-header">
                <h2>{useMonth} Transactions</h2>
                <NavLink to='/expense-page' className={'history-detail'}><h2>View in detail</h2></NavLink>
            </div>
            <div className="history-content">
                {history.map((item) => {
                    const { _id, title, amount, type } = item
                    return (
                        <div key={_id} className="history-item">
                            <p style={{
                                color: type === 'expense' ? 'red' : 'var(--color-green)'
                            }}>
                                {title}
                            </p>

                            <p style={{
                                color: type === 'expense' ? 'red' : 'var(--color-green)'
                            }}>
                                {
                                    type === 'expense' ? `-${amount <= 0 ? 0 : amount}` : `+${amount <= 0 ? 0 : amount}`
                                }
                            </p>
                        </div>
                    )
                })}
            </div>
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .history-header {
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
    
    .history-item{
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

export default History
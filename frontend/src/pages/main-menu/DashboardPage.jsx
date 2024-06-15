import React, { useEffect, useState } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/icons/Icons';
import styled from 'styled-components';
import History from '../../components/history/History';
import OverviewHistory from '../../components/history/OverviewHistory';

const DashboardPage = () => {

    const [user, setUser] = useState("Van")
    const [dateLeft, setDayLeft] = useState("12")
    const [useMonth, setMonth] = useState("March")

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="container">
                    <h1>Hello {user}</h1>
                    <span>Welcome back!</span>
                    <div className="amount-con">
                        <div className="income text-sm">
                            <h2>Total Income</h2>
                            <p>
                                {dollar} 1000
                            </p>
                        </div>
                        <div className="saving">
                            <h2>Saving Account</h2>
                            <p>
                                {dollar} 500
                            </p>
                        </div>
                        <div className="expense">
                            <h2>Total Expense</h2>
                            <p>
                                {dollar} 200
                            </p>
                        </div>
                        <div className="monthly-saving">
                            <h2>March Savings</h2>
                            <p>
                                {dollar} 3000
                            </p>
                        </div>
                    </div>
                    <div className='histories-con'>
                        <History/>
                        <OverviewHistory/>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled >
    )
}

const DashboardStyled = styled.div`
  .amount-con {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin: 1.25rem 0;
  }
  .income,
    .saving,
    .expense,
    .monthly-saving,
    .history-con,
    .history-overview {
      background: var(--component-color);
      border: 2px solid #191a16;
      box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
      border-radius: 20px;
      padding: 1rem 1.25rem;
  }

  .table, th, td {
    --bs-table-bg: transparent;
    border: none;
  }

  .histories-con {
    display: grid;
    grid-template-columns: 4fr 2fr;
    gap: 1rem;
    .edit-btn {
      color: var(--edit-btn);
    }
    .del-btn {
      color: var(--delete-btn); 
    }
  }
`


export default DashboardPage
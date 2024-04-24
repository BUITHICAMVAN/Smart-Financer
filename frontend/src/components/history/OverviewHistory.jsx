import React, { useState } from 'react'
import styled from 'styled-components'

const OverviewHistory = () => {
    const [dateLeft, setDayLeft] = useState("12")
    return (
        <OverviewHistoryStyled>
            <div className="history-overview">
                <h2>March Overview</h2>
                <table className='table table-responsive'>
                    <thead>
                        <tr>
                            <th><span>Categories</span></th>
                            <th><span>Spent</span></th>
                            <th><span>Left</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span>Needs</span></td>
                            <td><span>2</span></td>
                            <td><span>3</span></td>
                        </tr>
                        <tr>
                            <td><span>Wants</span></td>
                            <td><span>2</span></td>
                            <td><span>3</span></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><span style={{ color: 'green' }}>Total savings: $10000</span></td>
                            <td><span>{dateLeft} days left</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </OverviewHistoryStyled>
    )
}

export default OverviewHistory

const OverviewHistoryStyled = styled.div`
    .history-overview {
      thead > tr {
        background-color: rgba(39, 39, 42, 1);
      }
    }
`
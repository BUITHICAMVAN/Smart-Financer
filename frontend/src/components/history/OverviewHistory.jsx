import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getCurrentMonth } from '../../utils/CurrentDate'
import { getDaysLeftInMonth } from '../../utils/DayLeft'
import { useSelector } from 'react-redux'
import useTransaction from '../../customHooks/TransactionHook'
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol'

const OverviewHistory = () => {
    const dayLeft = getDaysLeftInMonth()
    const currentMonth = getCurrentMonth()
    const { fetchCurrentMonthSaving } = useTransaction('savings')

    const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit)
    const currentMonthSaving = useSelector(state => state.transactionReducer.currentMonthSaving)

    useEffect(() => {
        fetchCurrentMonthSaving()
    }, [])

    return (
        <OverviewHistoryStyled>
            <div className="history-overview">
                <h2>{currentMonth} Overview</h2>
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
                            <td colSpan="2"><span style={{ color: 'green' }}>Total savings: {getCurrencySymbol(currentUnit)}{currentMonthSaving}</span></td>
                            <td><span>{dayLeft} days left</span></td>
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
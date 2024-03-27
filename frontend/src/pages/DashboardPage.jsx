import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext';
import History from '../components/history/History';
import { InnerLayout } from '../styles/Layouts';
import { dollar } from '../utils/Icons';
import { DashboardStyled } from '../styles/DashboardStyle';
import { NavLink } from 'react-router-dom';

const DashboardPage = () => {

    const [user, setUser] = useState("Van")
    const [dateLeft, setDayLeft] = useState("12")
    const [useMonth, setMonth] = useState("March")
    const { totalExpenses, incomes, expenses, totalIncome, totalSaving, getIncomes, getExpenses } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="container">
                    <h1>Hello {user}</h1>
                    <span>Welcome back!</span>
                    {/* <Chart /> */}
                    <div className="amount-con">
                        <div className="income text-sm">
                            <h2>Total Income</h2>
                            <p>
                                {dollar} {totalIncome()}
                            </p>
                        </div>
                        <div className="saving">
                            <h2>Saving Account</h2>
                            <p>
                                {dollar} {totalSaving()}
                            </p>
                        </div>
                        <div className="expense">
                            <h2>Total Expense</h2>
                            <p>
                                {dollar} {totalExpenses()}
                            </p>
                        </div>
                        <div className="monthly-saving">
                            <h2>March Savings</h2>
                            <p>
                                {dollar} {totalSaving()}
                            </p>
                        </div>
                    </div>
                    <div className='histories-con'>
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
                                        <td colspan="2"><span style={{ color: 'green' }}>Total savings: $10000</span></td>
                                        <td><span>{dateLeft} days left</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled >
    )
}

export default DashboardPage
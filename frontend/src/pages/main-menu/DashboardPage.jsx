import React, { useEffect } from 'react'
import { InnerLayout } from '../../styles/Layouts';
import styled from 'styled-components';
import History from '../../components/history/History';
import OverviewHistory from '../../components/history/OverviewHistory';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAsync } from '../../reducers/UserReducer';
import { getCurrencySymbol } from '../../utils/format/CurrencySymbol';
import { calculateTotalAmount } from '../../utils/calculate/totalAmount';
import useTransaction from '../../customHooks/TransactionHook';
import { fetchCurrentMonthExpensesByTypeAsync, getExpenseActionAsync } from '../../reducers/ExpenseReducer';
import { getCurrentMonth } from '../../utils/CurrentDate';

const DashboardPage = () => {

    const dispatch = useDispatch()
    const { fetchTransactions: fetchIncomes } = useTransaction('incomes')
    const { fetchTransactions: fetchSavings, fetchCurrentMonthSaving } = useTransaction('savings')

    const username = useSelector(state => state.userReducer.user.user_fullname)
    const currentUnit = useSelector(state => state.userReducer.userCurrencyUnit)

    const incomes = useSelector(state => state.transactionReducer.transactions.incomes)
    const savings = useSelector(state => state.transactionReducer.transactions.savings)
    const expenses = useSelector(state => state.expenseReducer.expenses)

    const totalIncomes = calculateTotalAmount(incomes, 'income_amount')
    const totalSavings = calculateTotalAmount(savings, 'saving_amount')
    const totalExpenses = calculateTotalAmount(expenses, 'expense_amount')

    const currentMonth = getCurrentMonth()
    const currentMonthSaving = useSelector(state => state.transactionReducer.currentMonthSaving)

    useEffect(() => {
        dispatch(fetchUserAsync())
    }, [dispatch])

    useEffect(() => {
        fetchIncomes()
        fetchSavings()
    }, [])

    useEffect(() => {
        dispatch(getExpenseActionAsync())
    }, [dispatch])

    useEffect(() => {
        fetchCurrentMonthSaving()
    }, [])

    useEffect(() => {
        dispatch(fetchCurrentMonthExpensesByTypeAsync())
    }, [dispatch])
    return (
        <DashboardStyled>
            <InnerLayout>
                <div className="container">
                    <h1>Hello {username}</h1>
                    <span>Welcome back!</span>
                    <div className="amount-con">
                        <div className="income text-sm">
                            <h2>Total Income</h2>
                            <p>
                                {getCurrencySymbol(currentUnit)} {totalIncomes}
                            </p>
                        </div>
                        <div className="saving">
                            <h2>Saving Account</h2>
                            <p>
                                {getCurrencySymbol(currentUnit)} {totalSavings}
                            </p>
                        </div>
                        <div className="expense">
                            <h2>Total Expense</h2>
                            <p>
                                {getCurrencySymbol(currentUnit)} {totalExpenses}
                            </p>
                        </div>
                        <div className="monthly-saving">
                            <h2>{currentMonth} Savings</h2>
                            <p>
                                {getCurrencySymbol(currentUnit)} {currentMonthSaving}
                            </p>
                        </div>
                    </div>
                    <div className='histories-con'>
                        <History />
                        <OverviewHistory />
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

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
        p, span {
            font-size: 1.125rem;
            line-height: 1.75rem;
            font-weight: 700;
            letter-spacing: .025em;
        }
    }
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

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
`

export default DashboardPage

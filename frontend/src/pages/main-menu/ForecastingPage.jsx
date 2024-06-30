import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useDispatch, useSelector } from 'react-redux';
import ForecastTable from '../../components/tables/ForecastTable';
import { fetchForecastDataAsync } from '../../reducers/ForecastReducer';
import useTransactionType from '../../customHooks/TransactionTypeHook';
import { getExpenseTypesActionAsync } from '../../reducers/ExpenseTypeReducer';

const ForecastPage = () => {
  const dispatch = useDispatch();
  const forecast = useSelector(state => state.forecastReducer)
  const { fetchTransactionTypes: fetchIncomeTypes } = useTransactionType("income")
  const { fetchTransactionTypes: fetchSavingTypes } = useTransactionType("saving")
  const incomeTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.incomeTypes || [])
  const savingTypes = useSelector(state => state.transactionTypeReducer.transactionTypes.savingTypes || [])
  const expenseTypes = useSelector(state => state.expenseTypeReducer.expenseTypes)
  const [forecastingData, setForecastingData] = useState([]);

  useEffect(() => {
    dispatch(fetchForecastDataAsync());
  }, [dispatch]);

  useEffect(() => {
    if (forecast) {
      setForecastingData(forecast);
    }
  }, []);

  useEffect(() => {
    fetchIncomeTypes()
    fetchSavingTypes()
    dispatch(getExpenseTypesActionAsync())
  }, [])

  return (
    <ForecastPageStyled>
      <InnerLayout>
        <div className="container">
          <div className="content-container text-center">
            <h3 className="text-center">Forecast Actual Transactions</h3>
            <hr />
            <ForecastTable data={forecastingData} incomeTypes={incomeTypes} savingTypes={savingTypes} expenseTypes={expenseTypes} />
          </div>
        </div>
      </InnerLayout>
    </ForecastPageStyled>
  );
};

const ForecastPageStyled = styled.div`
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
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
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
  .white-text {
    color: white;
    font-weight: 400;
  }
  .na-text {
    font-size: 0.7em;
    color: gray;
  }
  .edit-btn {
    color: var(--edit-btn);
  }
  .del-btn {
    color: var(--delete-btn);
  }
;
`
export default ForecastPage;
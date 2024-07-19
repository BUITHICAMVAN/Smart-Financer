import React, { useEffect, useMemo } from 'react';
import styled from "styled-components";
import { MainLayout } from './styles/Layouts';
import Orb from './components/orbit/Orbit';
import Navigation from './components/navigation/Navigation';
import { Outlet } from 'react-router-dom';
import { fetchCurrencyRatesAsync } from './reducers/RatesReducer';
import { setCurrentCurrencyAsync, setUserIdsAsync } from './reducers/UserReducer';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  const userId = useSelector(state => state.userReducer.userId);

  useEffect(() => { // get User Id for all pages
    dispatch(setUserIdsAsync());
  }, [dispatch]);
  
  useEffect(() => { // get Currency Rates for all pages
    dispatch(fetchCurrencyRatesAsync());
  }, [dispatch]);

  useEffect(() => { // getCurrent
    if (userId) {
      dispatch(setCurrentCurrencyAsync(userId));
    }
  }, [dispatch, userId]);

  return (
    <AppStyled className="App">
      {orbMemo}
      <MainLayout>
        {userId && <Navigation />} 
        <main>
          <Outlet />
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-color: var(--background-color);
  position: relative;
  color: var(--color-white);
  main{
    flex: 1;
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;
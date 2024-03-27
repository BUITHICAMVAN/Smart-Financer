import React, { useMemo } from 'react'
import styled from "styled-components";
import { MainLayout } from './styles/Layouts'
import Orb from './components/orbit/Orbit'
import Navigation from './components/navigation/Navigation'
import { Outlet } from 'react-router-dom';

const App = () => {

  const orbMemo = useMemo(() => {
    return <Orb />
  }, [])

  return (
    <AppStyled className="App">
      {orbMemo}
      <MainLayout>
        <Navigation />
        <main>
          <Outlet/>
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
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
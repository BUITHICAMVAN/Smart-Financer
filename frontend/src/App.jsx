import React, {useState, useMemo} from 'react'
import styled from "styled-components";
import {MainLayout} from './styles/Layouts'
import Orb from './components/orbit/Orbit'
import Navigation from './components/navigation/Navigation'
import Dashboard from './pages/Dashboard';
import Income from './components/income/Income'
import Expenses from './components/expenses/Expense';
import { useGlobalContext } from './context/GlobalContext';

function App() {
  const [active, setActive] = useState(1)

  const global = useGlobalContext()
  console.log(global);

  const displayData = () => {
    switch(active){
      case 1:
        return <Dashboard />
      case 2:
        return <Dashboard />
      case 3:
        return <Income />
      case 4: 
        return <Expenses />
      default: 
        return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])

  return (
    <AppStyled className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>
          {displayData()}
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
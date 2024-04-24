import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { store } from './reducers/store/ConfigureStore'
import { GlobalStyle } from './styles/GlobalStyles';
import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import App from './App';
import DashboardPage from './pages/DashboardPage';
import CategoryPage from './pages/CategoryPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import CustomizePage from './pages/CustomizePage';
import ProfilePage from './pages/ProfilePage';
import SavingPage from './pages/SavingPage';
import { createBrowserHistory } from 'history'
import BudgetingPage from './pages/BudgetingPage';

export const history = createBrowserHistory()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <HistoryRouter history={history}>
      <Provider store={store}>
        <Routes>
          <Route path='' element={<App />}>
            <Route index element={<DashboardPage />}></Route>
            <Route path='/dashboard-page' element={<DashboardPage />}></Route>
            <Route path='/category-page' element={<CategoryPage />}></Route>
            <Route path='/income-page' element={<IncomePage />}></Route>
            <Route path='saving-page' element={<SavingPage />}></Route>
            <Route path='/expense-page' element={<ExpensePage />}></Route>
            <Route path='/customize-page' element={<CustomizePage />}></Route>
            <Route path='/profile-page' element={<ProfilePage />}></Route>
            <Route path='/budgeting-page' element={<BudgetingPage />}></Route>
          </Route>
        </Routes>
      </Provider>
    </HistoryRouter>
  </React.StrictMode>
);

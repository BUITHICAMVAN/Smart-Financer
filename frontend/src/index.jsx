import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './reducers/store/ConfigureStore'
import { GlobalStyle } from './styles/GlobalStyles'
import { Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import App from './App'
import DashboardPage from './pages/main-menu/DashboardPage'
import CategoryPage from './pages/main-menu/CategoryPage'
import IncomePage from './pages/main-menu/IncomePage'
import ExpensePage from './pages/main-menu/ExpensePage'
import ProfilePage from './pages/account/ProfilePage'
import SavingPage from './pages/main-menu/SavingPage'
import { createBrowserHistory } from 'history'
import BudgetingPage from './pages/main-menu/BudgetingPage'
import SignInPage from './pages/authenticate/SignInPage'
import SignUpPage from './pages/authenticate/SignUpPage'
import { LandingPage } from './pages/LandingPage'
import CustomizePage from './pages/account/CustomizePage'
import ReportPage from './pages/main-menu/ReportPage'
import DuePage from './pages/main-menu/DuePage'

export const history = createBrowserHistory()

const root = ReactDOM.createRoot(document.getElementById('root'))
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
            <Route path='/report-page' element={<ReportPage/>}></Route>
            <Route path='/customize-page' element={<CustomizePage />}></Route>
            <Route path='/profile-page' element={<ProfilePage />}></Route>
            <Route path='/budgeting-page' element={<BudgetingPage />}></Route>
            <Route path='/signin-page' element={<SignInPage/>}></Route>
            <Route path='/signup-page' element={<SignUpPage/>}></Route>
            <Route path='/landing-page' element={<LandingPage/>}></Route>
            <Route path='/due-page' element={<DuePage/>}></Route>
          </Route>
        </Routes>
      </Provider>
    </HistoryRouter>
  </React.StrictMode>
)

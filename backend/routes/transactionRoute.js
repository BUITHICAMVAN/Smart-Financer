const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/income/incomeController');
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expense/expenseController');
const { createAccount, getAccountDetails, updateAccount, deleteAccount } = require('../controllers/accountController');
const { getSystemSetting, updateSystemSetting } = require('../controllers/systemSettingController');
const { addSaving, getSavings, updateSaving, deleteSaving } = require('../controllers/saving/savingController');
const { getUserDetails, updateUser, deleteUser, getAllUsers, createUser } = require('../controllers/userController');
const { verifyToken } = require('../utils/verifyToken');
const { signup, signin, forgotpassword, signout } = require('../controllers/authController');
const { getUserIncomeTypes } = require('../controllers/income/incomeTypeController');
const { getUserSavingTypes } = require('../controllers/saving/savingTypeController');
const { getUserExpenseTypes, getExpenseTypeById } = require('../controllers/expense/expenseTypeController');

const router = require('express').Router();

// User Routes
router.get('/users/:id', getUserDetails) // Get user details by ID
    .put('/users/:id', verifyToken, updateUser) // Update a user by ID
    .delete('/users/:user_id', verifyToken, deleteUser) // Delete a user by ID
    .get('/users', getAllUsers)
    .post('/users', createUser)

// Income Routes
router.post('/incomes', verifyToken, addIncome) // Create a new income
    .get('/incomes', verifyToken, getIncomes) // Get all incomes for a user
    .put('/incomes/:income_id', verifyToken, updateIncome) // Update an income by ID
    .delete('/incomes/:income_id', verifyToken, deleteIncome) // Delete an income by ID

// Income Type
router.get('/income-types', verifyToken, getUserIncomeTypes)

// Saving Type
router.get('/saving-types', verifyToken, getUserSavingTypes)

// Expense Routes
router.post('/expenses', verifyToken, addExpense) // Create a new expense
    .get('/expenses', verifyToken, getExpenses) // Get all expenses for a user
    .put('/expenses/:expense_id', verifyToken, updateExpense) // Update an expense by ID
    .delete('/expenses/:expense_id', verifyToken, deleteExpense) // Delete an expense by ID
// Expense Type Routes
router.get('/expense-types', verifyToken, getUserExpenseTypes)
    .get('/expense-types/:expense_type_id', verifyToken, getExpenseTypeById)

// Account Routes
router.post('/accounts', verifyToken, createAccount) // Create a new account
    .get('/accounts/:id', verifyToken, getAccountDetails) // Get account details by ID
    .put('/accounts/:id', verifyToken, updateAccount) // Update an account by ID
    .delete('/accounts/:id', verifyToken, deleteAccount) // Delete an account by ID

// System Settings Routes
router.get('/system-setting', verifyToken, getSystemSetting) // Get system settings
    .put('/system-settings/:id', verifyToken, updateSystemSetting) // Update system settings by ID

// Saving Routes
router.post('/savings', verifyToken, addSaving) // Create a new saving
    .get('/savings', verifyToken, getSavings) // Get all savings for a user
    .put('/savings/:saving_id', verifyToken, updateSaving) // Update a saving by ID
    .delete('/savings/:saving_id', verifyToken, deleteSaving) // Delete a saving by ID

// Auth Routes
router.post('/signup', signup)
    .post('/signin', signin)
    .post('/forgotpassword', forgotpassword)
    .post('/signout', signout)

module.exports = router

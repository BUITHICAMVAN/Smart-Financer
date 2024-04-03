const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { createAccount, getAccountDetails, updateAccount, deleteAccount } = require('../controllers/accountController');
const { getSystemSettings, updateSystemSettings } = require('../controllers/systemSettingsController');
const { addSaving, getSavings, updateSaving, deleteSaving } = require('../controllers/savingController');
const { createUser, getUserDetails, updateUser, deleteUser } = require('../controllers/userController');

const router = require('express').Router();

// Income Routes
router.post('/incomes', addIncome) // Create a new income
    .get('/incomes', getIncomes) // Get all incomes for a user
    .put('/incomes/:id', updateIncome) // Update an income by ID
    .delete('/incomes/:id', deleteIncome) // Delete an income by ID

// Expense Routes
router.post('/expenses', addExpense) // Create a new expense
    .get('/expenses', getExpenses) // Get all expenses for a user
    .put('/expenses/:id', updateExpense) // Update an expense by ID
    .delete('/expenses/:id', deleteExpense) // Delete an expense by ID

// Account Routes
router.post('/accounts', createAccount) // Create a new account
    .get('/accounts/:id', getAccountDetails) // Get account details by ID
    .put('/accounts/:id', updateAccount) // Update an account by ID
    .delete('/accounts/:id', deleteAccount) // Delete an account by ID

// System Settings Routes
router.get('/system-settings', getSystemSettings) // Get system settings
    .put('/system-settings/:id', updateSystemSettings) // Update system settings by ID

// Saving Routes
router.post('/savings', addSaving) // Create a new saving
    .get('/savings', getSavings) // Get all savings for a user
    .put('/savings/:id', updateSaving) // Update a saving by ID
    .delete('/savings/:id', deleteSaving) // Delete a saving by ID

// User Routes
router.post('/users', createUser) // Create a new user
    .get('/users/:id', getUserDetails) // Get user details by ID
    .put('/users/:id', updateUser) // Update a user by ID
    .delete('/users/:id', deleteUser) // Delete a user by ID

module.exports = router
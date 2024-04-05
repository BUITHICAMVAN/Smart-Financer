const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { createAccount, getAccountDetails, updateAccount, deleteAccount } = require('../controllers/accountController');
const { getSystemSetting, updateSystemSetting } = require('../controllers/systemSettingController');
const { addSaving, getSavings, updateSaving, deleteSaving } = require('../controllers/savingController');
const { getUserDetails, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');
const {verifyToken} = require('../utils/verifyToken');
const { signup, signin, forgotpassword, signout } = require('../controllers/authController');

const router = require('express').Router();

// User Routes
router.get('/users/:id', getUserDetails) // Get user details by ID
    .put('/users/:id', verifyToken, updateUser) // Update a user by ID
    .delete('/users/:user_id', verifyToken, deleteUser) // Delete a user by ID
    .get('/users', getAllUsers)

// Income Routes
router.post('/incomes', verifyToken, addIncome) // Create a new income
    .get('/incomes', verifyToken, getIncomes) // Get all incomes for a user
    .put('/incomes/:income_id', verifyToken, updateIncome) // Update an income by ID
    .delete('/incomes/:income_id', verifyToken, deleteIncome) // Delete an income by ID

// Expense Routes
router.post('/expenses', verifyToken, addExpense) // Create a new expense
    .get('/expenses', verifyToken, getExpenses) // Get all expenses for a user
    .put('/expenses/:expense_id', verifyToken, updateExpense) // Update an expense by ID
    .delete('/expenses/:expense_id', verifyToken, deleteExpense) // Delete an expense by ID

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

// const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/incomeController');
// const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
// const { createAccount, getAccountDetails, updateAccount, deleteAccount } = require('../controllers/accountController');
// const { getSystemSetting, updateSystemSetting } = require('../controllers/systemSettingController');
// const { addSaving, getSavings, updateSaving, deleteSaving } = require('../controllers/savingController');
// const { createUser, getUserDetails, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');
// const verifyToken = require('../utils/verifyToken');

// const router = require('express').Router();

// // User Routes
// router.post('/users', createUser) // Create a new user
//     .get('/users/:id', verifyToken, getUserDetails) // Get user details by ID
//     .put('/users/:id', verifyToken, updateUser) // Update a user by ID
//     .delete('/users/:id', verifyToken, deleteUser) // Delete a user by ID
//     .get('/users', verifyToken, getAllUsers) // Get all users

// // Income Routes
// router.post('/incomes', verifyToken, addIncome) // Create a new income
//     .get('/incomes', verifyToken, getIncomes) // Get all incomes for a user
//     .put('/incomes/:id', verifyToken, updateIncome) // Update an income by ID
//     .delete('/incomes/:id', verifyToken, deleteIncome); // Delete an income by ID

// // Expense Routes
// router.post('/expenses', verifyToken, addExpense) // Create a new expense
//     .get('/expenses', verifyToken, getExpenses) // Get all expenses for a user
//     .put('/expenses/:id', verifyToken, updateExpense) // Update an expense by ID
//     .delete('/expenses/:id', verifyToken, deleteExpense); // Delete an expense by ID

// // Account Routes
// router.post('/accounts', verifyToken, createAccount) // Create a new account
//     .get('/accounts/:id', verifyToken, getAccountDetails) // Get account details by ID
//     .put('/accounts/:id', verifyToken, updateAccount) // Update an account by ID
//     .delete('/accounts/:id', verifyToken, deleteAccount); // Delete an account by ID

// // System Settings Routes
// router.get('/system-setting', verifyToken, getSystemSetting) // Get system settings
//     .put('/system-settings/:id', verifyToken, updateSystemSetting); // Update system settings by ID

// // Saving Routes
// router.post('/savings', verifyToken, addSaving) // Create a new saving
//     .get('/savings', verifyToken, getSavings) // Get all savings for a user
//     .put('/savings/:id', verifyToken, updateSaving) // Update a saving by ID
//     .delete('/savings/:id', verifyToken, deleteSaving); // Delete a saving by ID

// module.exports = router;

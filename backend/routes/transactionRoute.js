const { addExpense, getExpense, deleteExpense } = require('../controllers/expenseController');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/incomeController');

const router = require('express').Router();

// router.get('/', (req, res) => {
//     res.send('Hello Smart Financer')
// })


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)

module.exports = router
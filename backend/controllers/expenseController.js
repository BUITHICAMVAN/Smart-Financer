const Expense = require("../models/expense/expenseModel"); // Correctly import the model

exports.addExpense = async (req, res) => {
    const { expense_amount, expense_type_id, expense_note, expense_created_at } = req.body;

    // Correct validations to match model fields
    if (!expense_amount || !expense_type_id) {
        return res.status(400).json({ message: 'Amount and type are required!' });
    }

    if (expense_amount <= 0 || typeof expense_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        const expense = await Expense.create({ // Use Sequelize create method
            expense_user_id: req.user.id, 
            expense_amount,
            expense_type_id,
            expense_note, 
            expense_created_at: expense_created_at || new Date()
        });

        res.status(201).json({ message: 'Expense Added', data: expense });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ // Use Sequelize findAll method
            where: { expense_user_id: req.user.id }, 
            order: [['expense_created_at', 'DESC']] // Sort by creation date
        });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Expense.destroy({ // Use Sequelize destroy method
            where: { 
                expense_id: id,
                expense_user_id: req.user.id // Ensure the expense belongs to the user
            }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Expense not found or not authorized' });
        }

        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateExpense = async (req, res) => {
    const { id } = req.params; // ID of the expense to update
    const { expense_amount, expense_type_id, expense_note, expense_created_at } = req.body;

    // Basic validations
    if (!expense_amount || !expense_type_id) {
        return res.status(400).json({ message: 'Amount and type are required!' });
    }

    if (expense_amount <= 0 || typeof expense_amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a positive number!' });
    }

    try {
        // Find the expense record by ID and user ID to ensure ownership
        const expense = await Expense.findOne({
            where: {
                expense_id: id,
                expense_user_id: req.user.id
            }
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update the expense with new values
        expense.expense_amount = expense_amount;
        expense.expense_type_id = expense_type_id;
        expense.expense_note = expense_note;
        if (expense_created_at) { // Only update the created_at if provided
            expense.expense_created_at = expense_created_at;
        }

        // Save the updated expense
        await expense.save();
        res.status(200).json({ message: 'Expense updated', data: expense });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server Error', error });
    }
};

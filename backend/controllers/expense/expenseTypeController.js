const Expense = require('../../models/expense/expenseModel');
const ExpenseType = require('../../models/expense/expenseTypeModel');
const ExpenseCategory = require('../../models/expense/expenseCategoryModel');

// Fetch user expense types
exports.getUserExpenseTypes = async (req, res) => {
    try {
        // Validate user ID
        if (!Number.isInteger(req.user.user_id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const userExpensesWithTypes = await Expense.findAll({
            where: { expense_user_id: req.user.user_id },
            include: [{
                model: ExpenseType,
                attributes: ['expense_type_id', 'expense_type_name'],
                include: [{
                    model: ExpenseCategory,
                    attributes: ['expense_category_id', 'expense_category_name']
                }]
            }],
            order: [['expense_type_id', 'ASC']]
        });

        const expenseTypeAttributes = userExpensesWithTypes.map(expense => {
            return expense.ExpenseType;
        });
        res.json(expenseTypeAttributes);

    } catch (error) {
        console.error('Failed to fetch expense types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch expense type by ID
exports.getExpenseTypeById = async (req, res) => {
    const { expense_type_id } = req.params;
    try {
        // Validate expense type ID
        const typeId = parseInt(expense_type_id, 10);
        if (isNaN(typeId)) {
            return res.status(400).json({ message: 'Invalid expense type ID' });
        }

        // Fetch the expense type
        const expenseType = await ExpenseType.findOne({
            where: { expense_type_id: typeId },
            attributes: ['expense_type_id', 'expense_type_name', 'expense_category_id'],
            include: [{
                model: ExpenseCategory,
                attributes: ['expense_category_id', 'expense_category_name']
            }]
        });

        if (!expenseType) {
            return res.status(404).json({ message: 'Expense type not found' });
        }

        res.json(expenseType);
    } catch (error) {
        console.error('Failed to fetch expense type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add new expense type
exports.addExpenseType = async (req, res) => {
    const { expense_type_name, expense_category_id } = req.body;
    try {
        if (!expense_type_name || !expense_category_id) {
            return res.status(400).json({ message: 'Expense type name and category are required' });
        }

        const newExpenseType = await ExpenseType.create({ expense_type_name, expense_category_id });
        res.status(201).json(newExpenseType);
    } catch (error) {
        console.error('Failed to add expense type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update expense type
exports.updateExpenseType = async (req, res) => {
    const { expense_type_id } = req.params;
    const { expense_type_name, expense_category_id } = req.body;

    try {
        const typeId = parseInt(expense_type_id, 10);
        if (isNaN(typeId)) {
            return res.status(400).json({ message: 'Invalid expense type ID' });
        }

        const expenseType = await ExpenseType.findByPk(typeId);
        if (!expenseType) {
            return res.status(404).json({ message: 'Expense type not found' });
        }

        expenseType.expense_type_name = expense_type_name;
        expenseType.expense_category_id = expense_category_id;
        await expenseType.save();

        res.json(expenseType);
    } catch (error) {
        console.error('Failed to update expense type:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Fetch all expense types
exports.getAllExpenseTypes = async (req, res) => {
    try {
        const expenseTypes = await ExpenseType.findAll({
            attributes: ['expense_type_id', 'expense_type_name', 'expense_category_id'],
            include: [{
                model: ExpenseCategory,
                attributes: ['expense_category_id', 'expense_category_name']
            }],
            order: [['expense_type_id', 'ASC']]
        });
        res.status(200).json(expenseTypes);
    } catch (error) {
        console.error('Failed to fetch all expense types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

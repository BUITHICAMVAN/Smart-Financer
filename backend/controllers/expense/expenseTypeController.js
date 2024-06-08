const Expense = require("../../models/expense/expenseModel");
const ExpenseType = require("../../models/expense/expenseTypeModel");

exports.getUserExpenseTypes = async (req, res) => {
    try {
        // check if user is a passed in a valid id as an integer or not
        if (!Number.isInteger(req.user.user_id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const userExpensesWithTypes = await Expense.findAll({
            where: { expense_user_id: req.user.user_id }, // Filter expenses by the logged-in user's ID
            include: [{
                model: ExpenseType,
                attributes: ['expense_type_id', 'expense_type_name'], // Fetch specific attributes of expenseType
            }],
            order: [['expense_type_id', 'ASC']] // Order the results by expense_type_id
        });

        const expenseTypeAttributes = userExpensesWithTypes.map(expense => {
            return expense.ExpenseType; // This will give you an array of expenseType objects
        });
        res.json(expenseTypeAttributes);

    } catch (error) {
        console.error('Failed to fetch expense types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.getExpenseTypeById = async (req, res) => {
    const { expense_type_id } = req.params;
    try {
        // Check if expense_type_id is a valid integer
        const typeId = parseInt(expense_type_id, 10);
        if (isNaN(typeId)) {
            return res.status(400).json({ message: 'Invalid expense type ID' });
        }

        // Fetch the expense type
        const expenseType = await ExpenseType.findOne({
            where: { expense_type_id: typeId },
            attributes: ['expense_type_id', 'expense_type_name']
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
